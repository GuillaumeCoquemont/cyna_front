import React, { useState, useEffect } from 'react';
import styles from '../../styles/components/dashboardClient/DashboardPayments.module.css';

const mockPaymentMethods = [
  { id: 'pm_1', type: 'Visa', last4: '4242', expiry: '12/24', isDefault: true },
  { id: 'pm_2', type: 'MasterCard', last4: '5555', expiry: '11/23', isDefault: false },
];

export default function DashboardPayments() {
  const [methods, setMethods] = useState([]);

  useEffect(() => {
    // Simuler la récupération des moyens de paiement depuis le backend
    setMethods(mockPaymentMethods);
  }, []);

  const handleDelete = (id) => {
    // TODO: appel API pour supprimer
    setMethods(prev => prev.filter(m => m.id !== id));
  };

  const handleMakeDefault = (id) => {
    // TODO: appel API pour définir par défaut
    setMethods(prev =>
      prev.map(m => ({ ...m, isDefault: m.id === id }))
    );
  };

  return (
    <div className={styles.paymentsContainer}>
      <h3 className={styles.sectionTitle}>Mes moyens de paiement</h3>
      <div className={styles.methodsList}>
        {methods.map(m => (
          <div key={m.id} className={styles.methodCard}>
            <div className={styles.cardHeader}>
              <span>{m.type} •••• {m.last4}</span>
              {m.isDefault && <span className={styles.defaultBadge}>Par défaut</span>}
            </div>
            <div className={styles.cardBody}>
              <span>Exp: {m.expiry}</span>
              {!m.isDefault && (
                <button
                  className={styles.defaultBtn}
                  onClick={() => handleMakeDefault(m.id)}
                >
                  Définir par défaut
                </button>
              )}
              <button
                className={styles.deleteBtn}
                onClick={() => handleDelete(m.id)}
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
      <button className={styles.addBtn}>Ajouter un moyen de paiement</button>
    </div>
  );
}
