// src/components/dashboardClient/DashboardOrders.jsx
import React, { useState, useEffect } from 'react';
import styles from '../../styles/components/dashboardClient/DashboardOrders.module.css';
import { fetchOrders } from '../../api/orders';
import { fetchProducts } from '../../api/products';
import { fetchServices } from '../../api/services';

export default function DashboardOrders() {
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [orders, allProducts, allServices] = await Promise.all([
          fetchOrders(),
          fetchProducts(),
          fetchServices()
        ]);

        const productItems = orders.flatMap(o =>
          o.items
            .filter(i => i.product_id)
            .map(i => {
              const product = allProducts.find(p => p.id === i.product_id);
              return {
                ...i,
                orderId: o.id,
                name: product ? product.name : 'Produit inconnu',
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
                name: service ? service.Name : 'Service inconnu',
                quantity: i.Quantity,
                price: i.Price
              };
            })
        );

        setProducts(productItems);
        setServices(serviceItems);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError(err.message || 'Une erreur est survenue lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Chargement en cours...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.ordersContainer}>
      <h3 className={styles.sectionTitle}>Mes produits</h3>
      {products.length > 0 ? (
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
      ) : (
        <p>Aucun produit commandé</p>
      )}

      <h3 className={styles.sectionTitle}>Mes services</h3>
      {services.length > 0 ? (
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
      ) : (
        <p>Aucun service commandé</p>
      )}
    </div>
  );
}