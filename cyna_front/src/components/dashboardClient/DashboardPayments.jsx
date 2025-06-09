import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from '../../styles/components/dashboardClient/DashboardPayments.module.css';
import {
  fetchPaymentMethods,
  addPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} from '../../api/paymentMethods';
import AddPaymentMethodModal from '../modals/AddPaymentMethodModal';
import EditPaymentMethodModal from '../modals/EditPaymentMethodModal';

export default function DashboardPayments() {
  const [methods, setMethods] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    fetchPaymentMethods()
      .then(setMethods)
      .catch(console.error);
  }, []);

  const handleDelete = async (id) => {
    try {
      await deletePaymentMethod(id);
      setMethods(prev => prev.filter(m => m.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleMakeDefault = async (id) => {
    try {
      // Call API to mark this method as default
      await updatePaymentMethod(id, { isDefault: true });
      // Update local state
      setMethods(prev =>
        prev.map(m => ({ ...m, isDefault: m.id === id }))
      );
    } catch (error) {
      console.error('Erreur mise à jour par défaut :', error);
      window.alert('Impossible de définir ce moyen de paiement comme défaut');
    }
  };

  const handleAdd = () => setShowAddModal(true);

  const handleSaveNew = (newMethod) => {
    console.log('handleSaveNew called', newMethod);
    setMethods(prev => {
      if (newMethod.isDefault) {
        const cleared = prev.map(m => ({ ...m, isDefault: false }));
        return [...cleared, newMethod];
      }
      return [...prev, newMethod];
    });
  };

  const handleOpenEdit = (method) => {
    setSelectedMethod(method);
    setShowEditModal(true);
  };
  const handleCloseEdit = () => {
    setSelectedMethod(null);
    setShowEditModal(false);
  };
  const handleSaveEdit = async (updated) => {
    try {
      const saved = await updatePaymentMethod(updated.id, updated);
      setMethods(prev => {
        if (saved.isDefault) {
          return prev.map(m => m.id === saved.id ? saved : { ...m, isDefault: false });
        }
        return prev.map(m => m.id === saved.id ? saved : m);
      });
      setShowEditModal(false);
    } catch (error) {
      console.error(error);
      window.alert('Impossible de modifier le moyen de paiement');
    }
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
                className={styles.editBtn}
                onClick={() => handleOpenEdit(m)}
              >
                Modifier
              </button>
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
      <button className={styles.addBtn} onClick={handleAdd}>Ajouter un moyen de paiement</button>
      <AddPaymentMethodModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveNew}
        userId={user?.userId}
      />
      <EditPaymentMethodModal
        isOpen={showEditModal}
        onClose={handleCloseEdit}
        method={selectedMethod}
        onSave={handleSaveEdit}
      />
    </div>
  );
}
