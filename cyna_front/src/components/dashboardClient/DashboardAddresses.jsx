import React, { useState, useEffect } from 'react';
import styles from '../../styles/components/dashboardClient/DashboardAddresses.module.css';

const mockAddresses = [
  {
    id: 'addr1',
    label: 'Domicile',
    line1: "123 Rue de l'École",
    line2: '',
    city: 'Paris',
    zip: '75000',
    country: 'France',
    isDefault: true,
  },
  {
    id: 'addr2',
    label: 'Travail',
    line1: '45 Avenue des Champs-Élysées',
    line2: 'Bureau 12',
    city: 'Paris',
    zip: '75008',
    country: 'France',
    isDefault: false,
  },
];

export default function DashboardAddresses() {
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    // Simuler la récupération depuis le backend
    setAddresses(mockAddresses);
  }, []);

  const handleDelete = (id) => {
    // TODO: appel API pour supprimer
    setAddresses(prev => prev.filter(a => a.id !== id));
  };

  const handleMakeDefault = (id) => {
    // TODO: appel API pour définir par défaut
    setAddresses(prev =>
      prev.map(a => ({ ...a, isDefault: a.id === id }))
    );
  };

  return (
    <div className={styles.addressesContainer}>
      <h3 className={styles.sectionTitle}>Mes adresses</h3>
      <div className={styles.addressesList}>
        {addresses.map(addr => (
          <div key={addr.id} className={styles.addressCard}>
            <div className={styles.cardHeader}>
              <span>{addr.label}</span>
              {addr.isDefault && (
                <span className={styles.defaultBadge}>Par défaut</span>
              )}
            </div>
            <div className={styles.cardBody}>
              <address className={styles.addressText}>
                {addr.line1}<br />
                {addr.line2 && <>{addr.line2}<br /></>}
                {addr.zip} {addr.city}<br />
                {addr.country}
              </address>
              <div className={styles.actions}>
                {!addr.isDefault && (
                  <button
                    className={styles.defaultBtn}
                    onClick={() => handleMakeDefault(addr.id)}
                  >
                    Définir par défaut
                  </button>
                )}
                <button className={styles.editBtn}>Éditer</button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(addr.id)}
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className={styles.addBtn}>Ajouter une adresse</button>
    </div>
  );
}

