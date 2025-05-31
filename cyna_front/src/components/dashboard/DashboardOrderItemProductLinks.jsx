// File: src/components/dashboard/OrderItemServiceLinks.jsx
import React, { useState, useEffect } from 'react';
import {
  fetchOrderItemServiceLinks,
  addOrderItemServiceLink,
  deleteOrderItemServiceLink
} from '../../api/assoOrderItemsServices';
import { fetchOrderItems } from '../../api/orderItems';
import { fetchServices } from '../../api/services';
import styles from '../../styles/components/dashboard/OrderItemServiceLinks.module.css';

export default function OrderItemServiceLinks() {
  const [links, setLinks] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [services, setServices] = useState([]);
  const [newOrderItemId, setNewOrderItemId] = useState('');
  const [newServiceId, setNewServiceId] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1) Load existing links
    fetchOrderItemServiceLinks()
      .then(data => setLinks(data))
      .catch(err => console.error('Erreur fetch links:', err));

    // 2) Load order items for select
    fetchOrderItems()
      .then(data => setOrderItems(data))
      .catch(err => console.error('Erreur fetch order items:', err));

    // 3) Load services for select
    fetchServices()
      .then(data => setServices(data))
      .catch(err => console.error('Erreur fetch services:', err));
  }, []);

  const handleAddLink = async e => {
    e.preventDefault();
    setError(null);
    if (!newOrderItemId || !newServiceId) {
      setError('Veuillez sélectionner un ordre et un service.');
      return;
    }
    try {
      await addOrderItemServiceLink(+newOrderItemId, +newServiceId);
      const updated = await fetchOrderItemServiceLinks();
      setLinks(updated);
      setNewOrderItemId('');
      setNewServiceId('');
    } catch (err) {
      console.error('Erreur ajout liaison:', err);
      setError(err.message || 'Impossible d’ajouter cette liaison.');
    }
  };

  const handleDeleteLink = async (orderItemId, serviceId) => {
    if (!window.confirm('Confirmez la suppression de cette liaison ?')) return;
    try {
      await deleteOrderItemServiceLink(orderItemId, serviceId);
      setLinks(prev =>
        prev.filter(l => !(l.order_item_id === orderItemId && l.service_id === serviceId))
      );
    } catch (err) {
      console.error('Erreur suppression liaison:', err);
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Commandes d’article ↔ Services</h3>

      {/* Table of existing links */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Order Item ID</th>
            <th>Service</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {links.map(link => {
            const orderItemLabel =
              orderItems.find(o => o.id === link.order_item_id)?.id ||
              `ID : ${link.order_item_id}`;
            const serviceLabel =
              services.find(s => s.id === link.service_id)?.Name ||
              `ID : ${link.service_id}`;
            return (
              <tr key={`${link.order_item_id}-${link.service_id}`}>
                <td>OrderItem #{orderItemLabel}</td>
                <td>{serviceLabel} (ID : {link.service_id})</td>
                <td>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDeleteLink(link.order_item_id, link.service_id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            );
          })}
          {links.length === 0 && (
            <tr>
              <td colSpan="3">Aucune liaison trouvée.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Form to add new link */}
      <form className={styles.form} onSubmit={handleAddLink}>
        <div className={styles.field}>
          <label>Choisir Order Item</label>
          <select
            value={newOrderItemId}
            onChange={e => setNewOrderItemId(e.target.value)}
          >
            <option value="">-- Sélectionner --</option>
            {orderItems.map(item => (
              <option key={item.id} value={item.id}>
                OrderItem #{item.id}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label>Choisir Service</label>
          <select
            value={newServiceId}
            onChange={e => setNewServiceId(e.target.value)}
          >
            <option value="">-- Sélectionner --</option>
            {services.map(service => (
              <option key={service.id} value={service.id}>
                {service.Name} (ID : {service.id})
              </option>
            ))}
          </select>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.saveBtn}>
          Ajouter la liaison
        </button>
      </form>
    </div>
  );
}



