import React, { useState, useEffect } from 'react';
import styles from '../../styles/components/dashboardClient/DashboardUsersClient.module.css';
import { fetchUsers, fetchRoles } from '../../api/users';
import { fetchUserOrders, updateOrderStatus } from '../../api/orders';

export default function ClientList() {
  const [clients, setClients] = useState([]);
  const [roles, setRoles] = useState([]);
  const [expandedClient, setExpandedClient] = useState(null);
  const [clientOrders, setClientOrders] = useState({});
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    orderId: null,
    newStatus: null,
    oldStatus: null
  });

  const orderStatuses = [
    'En attente de confirmation',
    'En attente de paiement',
    'En cours de livraison',
    'Livré',
    'Annulé'
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersData, rolesData] = await Promise.all([
          fetchUsers(),
          fetchRoles()
        ]);
        setClients(usersData);
        setRoles(rolesData);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    };

    loadData();
  }, []);

  const handleClientClick = async (clientId) => {
    if (expandedClient === clientId) {
      setExpandedClient(null);
      setExpandedOrder(null);
      return;
    }

    try {
      const orders = await fetchUserOrders(clientId);
      setClientOrders(prev => ({
        ...prev,
        [clientId]: orders
      }));
      setExpandedClient(clientId);
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
    }
  };

  const handleOrderClick = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleStatusChange = (orderId, newStatus, oldStatus) => {
    setConfirmDialog({
      isOpen: true,
      orderId,
      newStatus,
      oldStatus
    });
  };

  const confirmStatusChange = async () => {
    try {
      setUpdatingStatus(true);
      await updateOrderStatus(confirmDialog.orderId, confirmDialog.newStatus);
      
      // Mettre à jour l'état local
      setClientOrders(prev => {
        const updatedOrders = { ...prev };
        Object.keys(updatedOrders).forEach(clientId => {
          updatedOrders[clientId] = updatedOrders[clientId].map(order => 
            order.id === confirmDialog.orderId ? { ...order, status: confirmDialog.newStatus } : order
          );
        });
        return updatedOrders;
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      alert('Erreur lors de la mise à jour du statut');
    } finally {
      setUpdatingStatus(false);
      setConfirmDialog({ isOpen: false, orderId: null, newStatus: null, oldStatus: null });
    }
  };

  const cancelStatusChange = () => {
    setConfirmDialog({ isOpen: false, orderId: null, newStatus: null, oldStatus: null });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'livré':
        return styles.statusDelivered;
      case 'en cours de livraison':
        return styles.statusShipping;
      case 'en attente de confirmation':
        return styles.statusPending;
      case 'en attente de paiement':
        return styles.statusPayment;
      case 'annulé':
        return styles.statusCanceled;
      default:
        return styles.statusDefault;
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Liste des clients</h3>
      {confirmDialog.isOpen && (
        <div className={styles.confirmDialog}>
          <div className={styles.confirmDialogContent}>
            <h4>Confirmer le changement de statut</h4>
            <p>
              Êtes-vous sûr de vouloir changer le statut de la commande #{confirmDialog.orderId} de 
              <strong> {confirmDialog.oldStatus} </strong> 
              à <strong> {confirmDialog.newStatus} </strong> ?
            </p>
            <div className={styles.confirmDialogActions}>
              <button 
                className={styles.confirmButton}
                onClick={confirmStatusChange}
                disabled={updatingStatus}
              >
                Confirmer
              </button>
              <button 
                className={styles.cancelButton}
                onClick={cancelStatusChange}
                disabled={updatingStatus}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
      <ul className={styles.userList}>
        {clients.map(client => (
          <li key={client.id} className={styles.userItem}>
            <div 
              className={styles.userHeader}
              onClick={() => handleClientClick(client.id)}
            >
              <span className={styles.userName}>{client.name}</span>
              <span className={styles.userEmail}>{client.email}</span>
              <span className={styles.userRole}>
                {roles.find(r => r.id === client.role_id)?.name || '—'}
              </span>
              <span className={styles.expandIcon}>
                {expandedClient === client.id ? '▼' : '▶'}
              </span>
            </div>
            
            {expandedClient === client.id && (
              <div className={styles.ordersContainer}>
                <h4>Commandes</h4>
                {clientOrders[client.id]?.length > 0 ? (
                  <div className={styles.ordersList}>
                    {clientOrders[client.id].map(order => (
                      <div key={order.id} className={styles.orderCard}>
                        <div 
                          className={styles.orderHeader}
                          onClick={() => handleOrderClick(order.id)}
                        >
                          <div className={styles.orderInfo}>
                            <span className={styles.orderId}>Commande #{order.id}</span>
                            <span className={styles.orderDate}>{formatDate(order.creationDate)}</span>
                            <span className={styles.orderTotal}>{order.totalPrice} €</span>
                            <div className={styles.statusContainer}>
                              <select
                                className={`${styles.orderStatus} ${getStatusColor(order.status)}`}
                                value={order.status}
                                onChange={(e) => handleStatusChange(order.id, e.target.value, order.status)}
                                onClick={(e) => e.stopPropagation()}
                                disabled={updatingStatus}
                              >
                                {orderStatuses.map(status => (
                                  <option key={status} value={status}>
                                    {status}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <span className={styles.expandIcon}>
                            {expandedOrder === order.id ? '▼' : '▶'}
                          </span>
                        </div>

                        {expandedOrder === order.id && (
                          <div className={styles.orderDetails}>
                            <div className={styles.orderItems}>
                              <h5>Produits</h5>
                              {order.OrderItems?.some(item => item.products?.length > 0) ? (
                                <ul className={styles.itemsList}>
                                  {order.OrderItems?.map(item =>
                                    item.products?.map(product => (
                                      <li key={product.id} className={styles.item}>
                                        <span className={styles.itemName}>{product.name}</span>
                                        <span className={styles.itemQuantity}>x{item.quantity}</span>
                                        <span className={styles.itemPrice}>{product.price} €</span>
                                      </li>
                                    ))
                                  )}
                                </ul>
                              ) : (
                                <p>Aucun produit</p>
                              )}

                              <h5>Services</h5>
                              {order.OrderItems?.some(item => item.services?.length > 0) ? (
                                <ul className={styles.itemsList}>
                                  {order.OrderItems?.map(item =>
                                    item.services?.map(service => (
                                      <li key={service.id} className={styles.item}>
                                        <span className={styles.itemName}>{service.name}</span>
                                        <span className={styles.itemQuantity}>x{item.quantity}</span>
                                        <span className={styles.itemPrice}>{service.price} €</span>
                                      </li>
                                    ))
                                  )}
                                </ul>
                              ) : (
                                <p>Aucun service</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>Aucune commande</p>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}