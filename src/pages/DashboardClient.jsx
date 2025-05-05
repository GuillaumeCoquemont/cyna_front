

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/pages/DashboardClient.module.css';
import DashboardOrders    from '../components/dashboardClient/DashboardOrders';
import DashboardPayments  from '../components/dashboardClient/DashboardPayments';
import DashboardAddresses from '../components/dashboardClient/DashboardAddresses';
import DashboardProfile   from '../components/dashboardClient/DashboardProfile';

export default function DashboardClient() {
  const [activeTab, setActiveTab] = useState('orders');

  const sidebarItems = [
    { key: 'orders',     label: 'Mes commandes' },
    { key: 'payments',   label: 'Moyens de paiement' },
    { key: 'addresses',  label: 'Adresses' },
    { key: 'profile',    label: 'Profil' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return <DashboardOrders />;
      case 'payments':
        return <DashboardPayments />;
      case 'addresses':
        return <DashboardAddresses />;
      case 'profile':
        return <DashboardProfile />;
      default:
        return <div>Aucun contenu à afficher</div>;
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <aside className={styles.sidebar}>
        <h2>Mon compte</h2>
        <ul>
          {sidebarItems.map(({ key, label }) => (
            <li
              key={key}
              className={activeTab === key ? styles.active : ''}
              onClick={() => setActiveTab(key)}
            >
              {label}
            </li>
          ))}
          <li>
            <Link to="/" onClick={() => setActiveTab('orders')}>
              Déconnexion
            </Link>
          </li>
        </ul>
      </aside>
      <main className={styles.mainContent}>
        {renderContent()}
      </main>
    </div>
  );
}