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
import DashboardTeam from '../components/dashboard/DashboardTeam';
import DashboardCategories from '../components/dashboard/DashboardCategories';
import ClientList from '../components/dashboard/DashboardClientList';
import CategoryRoleLinks from '../components/dashboard/DashboardCategoryRoleLinks';

import OrderItemProductLinks from '../components/dashboard/DashboardOrderItemProductLinks';
import OrderItemServiceLinks from '../components/dashboard/DashboardOrderItemServiceLinks';
import ServiceTypeRoleLinks from '../components/dashboard/DashboardServiceTypeRoleLinks';
import RolePromoCodeLinks from '../components/dashboard/DashboardRolePromoCodeLinks';
import ServiceRoleLinks from '../components/dashboard/DashboardServiceRoleLinks';
import DashboardAddressUserProfileLinks from '../components/dashboard/DashboardAddressUserProfileLinks';

import { fetchProducts } from '../api/products';
import { fetchSalesStats } from '../api/salesStats';

export default function DashboardAdmin() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const [productsData, setProductsData] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);

  useEffect(() => {
    // load real products on mount
    fetchProducts()
      .then(data => setProductsData(data))
      .catch(err => console.error('Erreur fetchProducts:', err));

    // load sales stats on mount
    fetchSalesStats()
      .then(data => setMonthlyStats(data))
      .catch(err => console.error('Erreur fetchSalesStats:', err));
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
    { key: 'messages', label: 'Messages' },
    { key: 'produits', label: 'Produits' },
    { key: 'services', label: 'Services' },
    { key: 'categories', label: 'Catégories' },
    { key: 'favoris', label: 'Favoris' },
    { key: 'clients',   label: 'Clients' },
    { key: 'ui', label: 'Carroussel' },
    { key: 'team', label: 'Team' },
    { key: 'liaisons-categories-roles', label: 'Catégories ↔ Rôles' },
    { key: 'liaisons-oip', label: 'Cmd↔Produits' },
    { key: 'liaisons-ois', label: 'Cmd↔Services' },
    { key: 'liaisons-str-roles', label: 'TypeSvc↔Rôles' },
    { key: 'liaisons-rol-promo', label: 'Rôles↔Promo' },
    { key: 'liaisons-svc-roles', label: 'Services↔Rôles' },
    { key: 'liaisons-addr-upp', label: 'Adresses↔Profils' },
    { key: 'params', label: 'Paramètres' },
    { key: 'code', label: 'Code Promo' },

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
      case 'categories':
        return (
          <div className={styles.dashboardContent}>
            <DashboardCategories />
          </div>
        );
      case 'liaisons-categories-roles':
        return (
          <div className={styles.dashboardContent}>
            <CategoryRoleLinks />
          </div>
        );
      case 'liaisons-oip':
        return (
          <div className={styles.dashboardContent}>
            <OrderItemProductLinks />
          </div>
        );
      case 'liaisons-ois':
        return (
          <div className={styles.dashboardContent}>
            <OrderItemServiceLinks />
          </div>
        );
      case 'liaisons-str-roles':
        return (
          <div className={styles.dashboardContent}>
            <ServiceTypeRoleLinks />
          </div>
        );
      case 'liaisons-rol-promo':
        return (
          <div className={styles.dashboardContent}>
            <RolePromoCodeLinks />
          </div>
        );
      case 'liaisons-svc-roles':
        return (
          <div className={styles.dashboardContent}>
            <ServiceRoleLinks />
          </div>
        );
      case 'liaisons-addr-upp':
        return (
          <div className={styles.dashboardContent}>
            <DashboardAddressUserProfileLinks />
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