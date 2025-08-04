// src/components/dashboardClient/DashboardOrders.jsx
import React, { useState, useEffect } from 'react';
import styles from '../../styles/components/dashboardClient/DashboardOrders.module.css';
import { fetchUserOrders } from '../../api/orders';
import { jwtDecode } from 'jwt-decode';

export default function DashboardOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Non connecté');
        }

        const decoded = jwtDecode(token);
        if (!decoded || !decoded.userId) {
          throw new Error('Token invalide');
        }

        const ordersData = await fetchUserOrders(decoded.userId);
        console.log('Données des commandes:', ordersData); // Pour déboguer
        setOrders(ordersData);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError(err.message || 'Une erreur est survenue lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleOrderClick = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'livré':
        return styles.statusDelivered;
      case 'en cours de livraison':
        return styles.statusShipping;
      case 'en attente de paiement':
        return styles.statusPayment;
      case 'en attente de confirmation':
        return styles.statusPending;
      default:
        return styles.statusDefault;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Erreur de formatage de la date:', error);
      return 'Date invalide';
    }
  };

  if (loading) {
    return <div className={styles.loading}>Chargement en cours...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.ordersContainer}>
      <h3 className={styles.sectionTitle}>Mes commandes</h3>
      {orders.length > 0 ? (
        <div className={styles.ordersList}>
          {orders.map(order => (
            <div key={order.id} className={styles.orderCard}>
              <div 
                className={styles.orderHeader}
                onClick={() => handleOrderClick(order.id)}
              >
                <div className={styles.orderInfo}>
                  <span className={styles.orderId}>Commande #{order.id}</span>
                  <span className={styles.orderDate}>
                    {formatDate(order.creationDate || order.creationdate)}
                  </span>
                  <span className={styles.orderTotal}>
                    {order.totalprice || order.totalPrice || 0} €
                  </span>
                  <span className={styles.paymentMethod}>
                    {order.Payment?.method ? `Payé via ${order.Payment.method}` : 'Méthode de paiement inconnue'}
                  </span>
                  <span className={`${styles.orderStatus} ${getStatusColor(order.status)}`}>
                    {order.status || 'En cours'}
                  </span>
                </div>
                <span className={styles.expandIcon}>
                  {expandedOrder === order.id ? '▼' : '▶'}
                </span>
              </div>
              
              {expandedOrder === order.id && order.OrderItems && order.OrderItems.length > 0 && (
                <div className={styles.orderDetails}>
                  {order.OrderItems.map(item => (
                    <div key={item.id} className={styles.orderItem}>
                      {item.products && item.products.length > 0 && (
                        <div className={styles.productsSection}>
                          <h4>Produits</h4>
                          <ul className={styles.itemsList}>
                            {item.products.map(product => (
                              <li key={product.id} className={styles.item}>
                                <span className={styles.itemName}>{product.name}</span>
                                <span className={styles.itemQuantity}>x{item.quantity}</span>
                                <span className={styles.itemPrice}>{product.price} €</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {item.services && item.services.length > 0 && (
                        <div className={styles.servicesSection}>
                          <h4>Services</h4>
                          <ul className={styles.itemsList}>
                            {item.services.map(service => (
                              <li key={service.id} className={styles.item}>
                                <span className={styles.itemName}>{service.name}</span>
                                <span className={styles.itemQuantity}>x{item.quantity}</span>
                                <span className={styles.itemPrice}>{service.price} €</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>Aucune commande trouvée</p>
      )}
    </div>
  );
}