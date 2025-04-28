import React, { useState } from 'react';
import styles from '../styles/pages/DashboardAdmin.module.css';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
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
import DashboardProducts from '../components/dashboard/DashboardProducts';
import ProductModal from '../components/modals/ProductModal';
import EditProductModal from '../components/modals/EditProductModal';
import DashboardMessage from '../components/dashboard/DashboardMessage';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Sélections de date pour filtrer les statistiques
const MONTHS = [
  { value: '01', label: 'Janvier' },
  { value: '02', label: 'Février' },
  { value: '03', label: 'Mars' },
  { value: '04', label: 'Avril' },
  { value: '05', label: 'Mai' },
  { value: '06', label: 'Juin' },
  { value: '07', label: 'Juillet' },
  { value: '08', label: 'Août' },
  { value: '09', label: 'Septembre' },
  { value: '10', label: 'Octobre' },
  { value: '11', label: 'Novembre' },
  { value: '12', label: 'Décembre' },
];
const YEARS = ['2024', '2025'];

// Données fictives de statistiques par mois/année
const STATS_DATA = {
  '2025-01': { users: 31200, orders: 8400, sales: 7000, pending: 1200 },
  '2025-02': { users: 35000, orders: 9200, sales: 8200, pending: 1500 },
  '2025-03': { users: 39000, orders: 9800, sales: 8600, pending: 1800 },
  '2025-04': { users: 40689, orders: 10293, sales: 8900, pending: 2040 },
  // autres mois à compléter…
};

export default function DashboardAdmin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showProductModal, setShowProductModal] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  const [selectedMonth, setSelectedMonth] = useState('04');
  const [selectedYear, setSelectedYear] = useState('2025');

  const key = `${selectedYear}-${selectedMonth}`;
  const currentStats = STATS_DATA[key] || STATS_DATA['2025-04'];

  const chartData = {
    labels: ['5k', '10k', '15k', '20k', '25k', '30k'],
    datasets: [{
      label: 'Ventes',
      data: [3500, 5500, 4000, 9000, 6000, 7000],
      borderColor: '#4e73df',
      backgroundColor: 'rgba(78, 115, 223, 0.1)',
      fill: true
    }]
  };

  const handleEditProduct = (productId) => {
    setProductToEdit(productId);
    setShowProductModal(true);
  };

  const handleSaveProduct = (saved) => {
    // TODO: mettre à jour la liste des produits si nécessaire
    setShowProductModal(false);
    setProductToEdit(null);
  };

  return (
    <div className={styles.dashboardContainer}>
      <aside className={styles.sidebar}>
        <h2>Admin</h2>
        <ul>
          <li className={activeTab === 'dashboard' ? styles.active : ''} onClick={() => setActiveTab('dashboard')}>Dashboard</li>
          <li className={activeTab === 'produits' ? styles.active : ''} onClick={() => setActiveTab('produits')}>Produits</li>
          <li className={activeTab === 'messages' ? styles.active : ''} onClick={() => setActiveTab('messages')}>Messages</li>
          <li className={activeTab === 'factures' ? styles.active : ''} onClick={() => setActiveTab('factures')}>Factures</li>
          <li><Link to="/">Déconnexion</Link></li>
        </ul>
      </aside>

      <main className={styles.mainContent}>
        {activeTab === 'dashboard' && (
          <>
            <h1>Dashboard</h1>
      <div style={{ display: 'flex', gap: '1rem', margin: '1rem 0' }}>
        <div>
          <label>Mois : </label>
          <select
            className={styles.filterSelect}
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
          >
            {MONTHS.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Année : </label>
          <select
            className={styles.filterSelect}
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value)}
          >
            {YEARS.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>
            <div className={styles.stats}>
      <div className={styles.card}>
        <div className={styles.cardIcon}>👥</div>
        <div className={styles.cardValue}>{currentStats.users.toLocaleString()}</div>
        <div className={styles.cardLabel}>Utilisateurs totaux</div>
        <div className={styles.cardChangePositive}>▲ 8.5% depuis hier</div>
      </div>
      <div className={styles.card}>
        <div className={styles.cardIcon}>📦</div>
        <div className={styles.cardValue}>{currentStats.orders.toLocaleString()}</div>
        <div className={styles.cardLabel}>Total commandes</div>
        <div className={styles.cardChangePositive}>▲1.3% depuis hier</div>
      </div>
      <div className={styles.card}>
        <div className={styles.cardIcon}>💶</div>
        <div className={styles.cardValue}>{currentStats.sales.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</div>
        <div className={styles.cardLabel}>Total vente</div>
        <div className={styles.cardChangeNegative}>▼4.3% depuis hier</div>
      </div>
      <div className={styles.card}>
        <div className={styles.cardIcon}>🕒</div>
        <div className={styles.cardValue}>{currentStats.pending.toLocaleString()}</div>
        <div className={styles.cardLabel}>Total Pending</div>
        <div className={styles.cardChangePositive}>▲1.8% depuis hier</div>
      </div>
    </div>
            {/* — GRAPHIQUE DETAIL DES VENTES — */}
            <div className={styles.tableWrapper}>
              <div className={styles.chartContainer}>
                <h2>Détails des ventes</h2>
                <Line data={chartData} />
              </div>
            </div>

            {/* — TABLEAU PRODUITS — */}
    <div className={styles.tableWrapper}>
      <table className={styles.salesTable}>
        <thead>
          <tr>
            <th>Nom produit</th>
            <th>Adresse</th>
            <th>Date – Time</th>
            <th>Quantité</th>
            <th>Montant</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Produit 1</td>
            <td>Adresse</td>
            <td>12.09.2019 - 12h00</td>
            <td>1</td>
            <td>34€</td>
            <td><span className={styles.statusDelivered}>Livré</span></td>
          </tr>
          <tr>
            <td>Produit 2</td>
            <td>Adresse</td>
            <td>12.09.2019 - 13h00</td>
            <td>2</td>
            <td>60 €</td>
            <td><span className={styles.statusPending}>En attente</span></td>
          </tr>
          <tr>
            <td>Produit 3</td>
            <td>Adresse</td>
            <td>12.09.2019 - 12h00</td>
            <td>1</td>
            <td>34€</td>
            <td><span className={styles.statusRejected}>Rejeté</span></td>
          </tr>
        </tbody>
      </table>
    </div>
    {/* — FIN TABLEAU PRODUITS — */}

          </>
        )}

        {activeTab === 'produits' && (
          <>
            <DashboardProducts
              onAddProduct={() => setShowProductModal(true)}
              onEditProduct={handleEditProduct}
            />
            {showProductModal && (
              productToEdit !== null ? (
                <EditProductModal
                  productId={productToEdit}
                  onClose={() => {
                    setShowProductModal(false);
                    setProductToEdit(null);
                  }}
                  onSave={handleSaveProduct}
                />
              ) : (
                <ProductModal
                  onSave={handleSaveProduct}
                  onClose={() => setShowProductModal(false)}
                />
              )
            )}
          </>
        )}

        {activeTab === 'messages' && (
          <DashboardMessage />
        )}

        {activeTab === 'factures' && (
          <div>Section Factures (à implémenter)</div>
        )}
      </main>
    </div>
  );
}