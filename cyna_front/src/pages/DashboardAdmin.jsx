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
import { API_BASE_URL } from '../api/config';

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
  const [userCount, setUserCount] = useState(null);
  const [orderCount, setOrderCount] = useState(null);
  const [pendingCount, setPendingCount] = useState(null);
  const [productSalesDetails, setProductSalesDetails] = useState([]);
  const [serviceSalesDetails, setServiceSalesDetails] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [servicesData, setServicesData] = useState([]);
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

    // Récupérer le nombre d'utilisateurs
    fetch(`${API_BASE_URL}/api/users/count`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => setUserCount(data.count));

    // Récupérer le nombre de commandes
    fetch(`${API_BASE_URL}/api/orders/count`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => setOrderCount(data.count));

    // Récupérer le nombre de commandes en attente
    fetch(`${API_BASE_URL}/api/orders/pending-count`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => setPendingCount(data.totalPending));

    fetch(`${API_BASE_URL}/api/orders/product-sales-details`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => setProductSalesDetails(data));

    fetch(`${API_BASE_URL}/api/orders/service-sales-details`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => setServiceSalesDetails(data));

    fetch(`${API_BASE_URL}/api/orders/pending-orders`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        console.log('pendingOrders API response:', data);
        setPendingOrders(Array.isArray(data) ? data : []);
      });

    fetch(`${API_BASE_URL}/api/services`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => setServicesData(data));
  }, []);

  const totalProductSales = monthlyStats.length > 0
    ? monthlyStats.reduce((sum, m) => sum + (m.productSales || 0), 0)
    : null;
  const totalServiceSales = monthlyStats.length > 0
    ? monthlyStats.reduce((sum, m) => sum + (m.serviceSales || 0), 0)
    : null;

  const statsData = [
    {
      title: 'Utilisateurs totaux',
      value: userCount !== null && userCount !== undefined
        ? userCount.toLocaleString('fr-FR')
        : 'Chargement...'
    },
    {
      title: 'Total commandes',
      value: orderCount !== null && orderCount !== undefined
        ? orderCount.toLocaleString('fr-FR')
        : 'Chargement...'
    },
    {
      title: 'Ventes produits',
      value: totalProductSales !== null
        ? totalProductSales.toLocaleString('fr-FR')
        : 'Chargement...'
    },
    {
      title: 'Ventes services',
      value: totalServiceSales !== null
        ? totalServiceSales.toLocaleString('fr-FR')
        : 'Chargement...'
    },
    {
      title: 'Total ventes',
      value: (totalProductSales !== null && totalServiceSales !== null)
        ? (totalProductSales + totalServiceSales).toLocaleString('fr-FR')
        : 'Chargement...'
    },
    {
      title: 'Total Pending',
      value: pendingCount !== null && pendingCount !== undefined
        ? pendingCount.toLocaleString('fr-FR')
        : 'Chargement...'
    },
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
        label: 'Produits (ventes)',
        data: monthlyStats.map(s => s.productSales),
        fill: false,
        tension: 0.4,
        borderColor: '#4E73DF',
        backgroundColor: '#4E73DF'
      },
      {
        label: 'Services (ventes)',
        data: monthlyStats.map(s => s.serviceSales),
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
              <h3>Liste des produits</h3>
              <table className={styles.pendingOrdersTable}>
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
            <div className={styles.tableContainer}>
              <h3 className={styles.salesDetailsSection}>Liste des services</h3>
              <table className={styles.pendingOrdersTable}>
                <thead>
                  <tr>
                    <th>Nom service</th>
                    <th>Prix</th>
                    <th>Type</th>
                    <th>Disponibilité</th>
                  </tr>
                </thead>
                <tbody>
                  {servicesData.map((s) => (
                    <tr key={s.id} className={!s.status ? styles.unavailableService : ''}>
                      <td>{s.name}</td>
                      <td>
                        {s.price ? Number(s.price).toLocaleString('fr-FR', {
                          style: 'currency',
                          currency: 'EUR'
                        }) : ''}
                      </td>
                      <td>{s.serviceType?.name || 'N/A'}</td>
                      <td>
                        {s.status ? 'Disponible' : (
                          <span className={styles.unavailableService}>
                            Indisponible
                            <span className={styles.unavailableIcon} title="Service indisponible">&#9888;</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={styles.salesDetailsSection}>
              <h3>Détail des ventes</h3>
              <h2>Détail des ventes par produit</h2>
              <ul className={styles.salesDetailsList}>
                {productSalesDetails.map(p => (
                  <li key={p.productName}>{p.productName} : {p.salesCount} ventes</li>
                ))}
              </ul>
              <h2>Détail des ventes par service</h2>
              <ul className={styles.salesDetailsList}>
                {serviceSalesDetails.map(s => (
                  <li key={s.serviceName}>{s.serviceName} : {s.salesCount} ventes</li>
                ))}
              </ul>
              <h2>Commandes en attente</h2>
              <table className={styles.pendingOrdersTable}>
                <thead>
                  <tr>
                    <th>ID Commande</th>
                    <th>Date</th>
                    <th>Statut</th>
                    <th>Montant</th>
                    <th>Utilisateur</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingOrders.map(o => (
                    <tr key={o.id}>
                      <td>{o.id}</td>
                      <td>{o.creationdate ? new Date(o.creationdate).toLocaleString('fr-FR') : ''}</td>
                      <td>{o.status}</td>
                      <td>{o.totalprice ? o.totalprice.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) : ''}</td>
                      <td>{o.User ? o.User.name : ''}</td>
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