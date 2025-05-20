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
import React, { useState, useEffect, useMemo } from 'react';
import styles from '../styles/pages/DashboardAdmin.module.css';
import { Link } from 'react-router-dom';
import DashboardMessage from '../components/dashboard/DashboardMessage';
import DashboardProducts from '../components/dashboard/DashboardProducts';
import { CarrouselEditor } from '../components/dashboard/DashboardCarrousselElements';
import DashboardCodePromo from '../components/dashboard/DashboardCodePromo';
import DashboardServices from '../components/dashboard/DashboardServices';
import { fetchProducts } from '../api/products';

export default function DashboardAdmin() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const [productsData, setProductsData] = useState([]);

  useEffect(() => {
    // load real products on mount
    fetchProducts()
      .then(data => setProductsData(data))
      .catch(err => console.error('Erreur fetchProducts:', err));
  }, []);

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
    { key: 'code', label: 'Code Promo' },
    { key: 'services', label: 'Services' },
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

  const lowStockProducts = useMemo(
    () => productsData.filter(p => p.stock > 0 && p.stock < 5),
    [productsData]
  );

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
                    <th>Stock</th>
                    <th>Prix</th>
                    <th>Disponibilité</th>
                  </tr>
                </thead>
                <tbody>
                  {productsData.map((p) => (
                    <tr key={p.id || p.name}>
                      <td>
                        {p.name}
                        {p.stock > 0 && p.stock < 5 && (
                          <span
                            className={styles.lowStockIcon}
                            title="Stock faible"
                            style={{ display: 'inline-block' }}
                          >
                            {'\u26A0'}
                          </span>
                        )}
                      </td>
                      <td>
                        {p.stock === 0 ? 'Rupture de stock' : p.stock}
                      </td>
                      <td>{p.price}</td>
                      <td>
                        {p.stock > 0 ? 'En stock' : 'Rupture de stock'}
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
          case 'code':
          return (
            <div className={styles.dashboardContent}>
              <DashboardCodePromo />
            </div>
          );
      case 'services':
        return (
          <div className={styles.dashboardContent}>
            <DashboardServices />
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