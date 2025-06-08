import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import styles from '../styles/pages/DashboardAdmin.module.css';
import { Link } from 'react-router-dom';
import DashboardMessage from '../components/dashboard/DashboardMessage';
import DashboardProducts from '../components/dashboard/DashboardProducts';
import { CarrouselEditor } from '../components/dashboard/DashboardCarrousselElements';
import DashboardCodePromo from '../components/dashboard/DashboardCodePromo';
import DashboardServices from '../components/dashboard/DashboardServices';
import DashboardTeam from '../components/dashboard/DashboardTeam';
import DashboardCategories from '../components/dashboard/DashboardCategories';
import ClientList from '../components/dashboard/DashboardClientList';


import { fetchProducts } from '../api/products';
import { fetchSalesStats } from '../api/salesStats';

// Enregistrement des composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardAdmin() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [productsData, setProductsData] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    // load real products on mount
    fetchProducts()
      .then(data => setProductsData(data))
      .catch(err => console.error('Erreur fetchProducts:', err));

    // load sales stats on mount
    fetchSalesStats()
      .then(data => setMonthlyStats(data))
      .catch(err => console.error('Erreur fetchSalesStats:', err));

    // Nettoyage du graphique lors du démontage du composant
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  const totalRevenue = monthlyStats.length > 0
    ? monthlyStats.reduce((sum, m) => sum + m.totalRevenue, 0)
    : null;
  const totalProductRevenue = monthlyStats.length > 0
    ? monthlyStats.reduce((sum, m) => sum + m.productRevenue, 0)
    : null;
  const totalServiceRevenue = monthlyStats.length > 0
    ? monthlyStats.reduce((sum, m) => sum + m.serviceRevenue, 0)
    : null;

  const statsData = [
    { title: 'Utilisateurs totaux', value: '40 689' },
    { title: 'Total commandes', value: '10 293' },
    {
      title: 'Ventes produits',
      value: totalProductRevenue !== null
        ? totalProductRevenue.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
        : 'Chargement...'
    },
    {
      title: 'Ventes services',
      value: totalServiceRevenue !== null
        ? totalServiceRevenue.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
        : 'Chargement...'
    },
    {
      title: 'Total ventes',
      value: totalRevenue !== null
        ? totalRevenue.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
        : 'Chargement...'
    },
    { title: 'Total Pending', value: '2 040' },
  ];

  const sidebarItems = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'categories', label: 'Catégories' },
    { key: 'produits', label: 'Produits' },
    { key: 'services', label: 'Services' },
    { key: 'messages', label: 'Messages' },
    { key: 'code', label: 'Codes Promo' },
    { key: 'favoris', label: 'Favoris' },
    { key: 'clients',   label: 'Clients' },
    { key: 'ui', label: 'Carroussel' },
    { key: 'team', label: 'Team' },
    { key: 'params', label: 'Paramètres' },


  ];

  const chartData = {
    labels: monthlyStats.map(s => s.month),
    datasets: [
      {
        label: 'Produits (€)',
        data: monthlyStats.map(s => s.productRevenue),
        fill: false,
        tension: 0.4,
        borderColor: '#4E73DF',
        backgroundColor: '#4E73DF'
      },
      {
        label: 'Services (€)',
        data: monthlyStats.map(s => s.serviceRevenue),
        fill: false,
        tension: 0.4,
        borderColor: '#1CC88A',
        backgroundColor: '#1CC88A'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Évolution des ventes mensuelles' }
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
              <Line 
                ref={chartRef}
                data={chartData} 
                options={chartOptions}
              />
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
      case 'categories':
        return (
          <div className={styles.dashboardContent}>
            <DashboardCategories />
          </div>
        );
      case 'services':
        return (
          <div className={styles.dashboardContent}>
            <DashboardServices />
          </div>
        );
      case 'team':
        return (
          <div className={styles.dashboardContent}>
            <DashboardTeam />
          </div>
        );
      
      case 'clients':
        return (
          <div className={styles.dashboardContent}>
            <ClientList />
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

  const handleSignOut = async (e) => {
    e.preventDefault();
    console.log('Déconnexion en cours...');
    try {
      await signOut();
      console.log('Déconnexion réussie');
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Vérification de l'authentification
  useEffect(() => {
    if (!user) {
      console.log('Utilisateur non connecté, redirection...');
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

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
            <button onClick={handleSignOut} className={styles.logoutButton}>
              Déconnexion
            </button>
          </li>
        </ul>
      </aside>
      <main className={styles.mainContent}>
        {renderContent()}
      </main>
    </div>
  );
}