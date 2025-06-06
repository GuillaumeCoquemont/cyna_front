import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/pages/DashboardClient.module.css';
import DashboardOrders    from '../components/dashboardClient/DashboardOrders';
import DashboardPayments  from '../components/dashboardClient/DashboardPayments';
import DashboardAddresses from '../components/dashboardClient/DashboardAddresses';
import DashboardProfile   from '../components/dashboardClient/DashboardProfile';
import DashboardMessages  from '../components/dashboardClient/DashboardMessagesClient';

export default function DashboardClient() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');

  const handleSignOut = (e) => {
    e.preventDefault();
    signOut();
    navigate('/');
  };

  const sidebarItems = [
    { key: 'orders',     label: 'Mes commandes' },
    { key: 'payments',   label: 'Moyens de paiement' },
    { key: 'messages',   label: 'Messages' },
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
      case 'messages':
        return <DashboardMessages />;
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
            <Link to="/" onClick={handleSignOut}>
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