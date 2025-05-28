// src/components/dashboardClient/DashboardOrders.jsx
import React, { useState, useEffect } from 'react';
import styles from '../../styles/components/dashboardClient/DashboardOrders.module.css';
import { fetchOrders } from '../../api/orders';
import { fetchProducts } from '../../api/products';
import { fetchServices } from '../../api/services';

export default function DashboardOrders() {
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    Promise.all([fetchOrders(), fetchProducts(), fetchServices()]).then(([orders, allProducts, allServices]) => {
      const productItems = orders.flatMap(o =>
        o.items
          .filter(i => i.product_id)
          .map(i => {
            const product = allProducts.find(p => p.id === i.product_id);
            return {
              ...i,
              orderId: o.id,
              name: product ? product.name : '',
              quantity: i.Quantity,
              price: i.Price
            };
          })
      );
      const serviceItems = orders.flatMap(o =>
        o.items
          .filter(i => i.service_id)
          .map(i => {
            const service = allServices.find(s => s.id === i.service_id);
            return {
              ...i,
              orderId: o.id,
              name: service ? service.Name : '',
              quantity: i.Quantity,
              price: i.Price
            };
          })
      );
      setProducts(productItems);
      setServices(serviceItems);
    });
  }, []);

  return (
    <div className={styles.ordersContainer}>
      <h3 className={styles.sectionTitle}>Mes produits</h3>
      <table className={styles.ordersTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Quantité</th>
            <th>Prix</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={`${p.orderId}-${p.product_id}`}>
              <td>{p.orderId}</td>
              <td>{p.name}</td>
              <td>{p.quantity}</td>
              <td>{p.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className={styles.sectionTitle}>Mes services</h3>
      <table className={styles.ordersTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Quantité</th>
            <th>Prix</th>
          </tr>
        </thead>
        <tbody>
          {services.map(s => (
            <tr key={`${s.orderId}-${s.service_id}`}>
              <td>{s.orderId}</td>
              <td>{s.name}</td>
              <td>{s.quantity}</td>
              <td>{s.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}