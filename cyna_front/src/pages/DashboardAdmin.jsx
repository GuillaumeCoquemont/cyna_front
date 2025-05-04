import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
import React, { useState } from 'react';
import styles from '../styles/pages/DashboardAdmin.module.css';
import { Link } from 'react-router-dom';
import DashboardMessage from '../components/dashboard/DashboardMessage';
import DashboardProducts from '../components/dashboard/DashboardProducts';
import { CarrouselEditor } from '../components/dashboard/CarrousselElements';

export default function DashboardAdmin() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const statsData = [
    { title: 'Utilisateurs totaux', value: '40 689' },
    { title: 'Total commandes', value: '10 293' },
    { title: 'Total vente', value: '89,00 €' },
    { title: 'Total Pending', value: '2 040' },
  ];

  const sidebarItems = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'messages', label: 'Messages' },
    { key: 'produits', label: 'Produits' },
    { key: 'favoris', label: 'Favoris' },
    { key: 'ui', label: 'Carroussel' },
    { key: 'team', label: 'Team' },
    { key: 'params', label: 'Paramètres' },
  ];

  const chartData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'Ventes',
        data: [1200, 1900, 3000, 2800, 3500, 4000],
        fill: false,
        tension: 0.4,
        borderColor: '#4E73DF',
        backgroundColor: '#4E73DF'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Évolution des ventes' }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  const products = [
    { name: 'Produit 1', address: 'Adresse', dateTime: '12.09.2019 - 12h00', quantity: 1, amount: '34 €', status: 'Livré' },
    { name: 'Produit 2', address: 'Adresse', dateTime: '12.09.2019 - 13h00', quantity: 2, amount: '60 €', status: 'En attente' },
    { name: 'Produit 3', address: 'Adresse', dateTime: '12.09.2019 - 12h00', quantity: 1, amount: '34 €', status: 'Rejeté' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className={styles.dashboardContent}>
            <h1>Tableau de bord</h1>
            <div className={styles.statsContainer}>
              {statsData.map(({ title, value }) => (
                <div key={title} className={styles.statCard}>
                  <h3>{title}</h3>
                  <p>{value}</p>
                </div>
              ))}
            </div>
            <div className={styles.chartContainer}>
              <Line data={chartData} options={chartOptions} />
            </div>
            <div className={styles.tableContainer}>
              <table>
                <thead>
                  <tr>
                    <th>Nom produit</th>
                    <th>Adresse</th>
                    <th>Date - Time</th>
                    <th>Nombre produit</th>
                    <th>Montant</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.name}>
                      <td>{p.name}</td>
                      <td>{p.address}</td>
                      <td>{p.dateTime}</td>
                      <td>{p.quantity}</td>
                      <td>{p.amount}</td>
                      <td>
                        <span
                          className={`${styles.statusBadge} ${
                            p.status === 'Livré'
                              ? styles.delivered
                              : p.status === 'En attente'
                                ? styles.pending
                                : styles.rejected
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'messages':
        return <DashboardMessage />;
      case 'produits':
        return (
          <div className={styles.dashboardContent}>
            <DashboardProducts />
          </div>
        );
        case 'ui':
          return (
            <div className={styles.dashboardContent}>
              <CarrouselEditor />
            </div>
          );
      default:
        return (
          <div className={styles.dashboardContent}>
            <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
            <p>Aucun contenu pour le moment</p>
          </div>
        );
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <aside className={styles.sidebar}>
        <h2>Admin</h2>
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
            <Link to="/" onClick={() => setActiveTab('dashboard')}>
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