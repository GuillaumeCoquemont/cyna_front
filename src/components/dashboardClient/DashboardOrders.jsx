// src/components/dashboard/DashboardOrders.jsx
import React, { useState, useEffect } from 'react';
import styles from '../../styles/components/dashboardClient/DashboardOrders.module.css';

const mockOrders = [
  { id: 'CMD-001', date: '2025-04-20', total: '120,00 €', status: 'Livrée' },
  { id: 'CMD-002', date: '2025-04-22', total: '75,50 €',  status: 'En cours' },
  { id: 'CMD-003', date: '2025-04-25', total: '210,00 €', status: 'Annulée' },
  { id: 'CMD-004', date: '2025-05-01', total: '49,99 €',  status: 'Livrée' },
];

export default function DashboardOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // ici tu ferais un fetch('/api/client/orders')…
    setOrders(mockOrders);
  }, []);

  return (
    <div className={styles.ordersContainer}>
      <h3 className={styles.sectionTitle}>Mes commandes récentes</h3>
      <table className={styles.ordersTable}>
        <thead>
          <tr>
            <th>Numéro</th>
            <th>Date</th>
            <th>Montant</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.date}</td>
              <td>{o.total}</td>
              <td>
                <span className={`${styles.statusBadge} ${
                  o.status === 'Livrée'   ? styles.delivered :
                  o.status === 'En cours'  ? styles.pending   :
                  styles.rejected
                }`}>
                  {o.status}
                </span>
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr>
              <td colSpan="4" className={styles.emptyMessage}>
                Aucune commande à afficher
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}