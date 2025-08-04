import React, { useState, useEffect } from 'react';
import styles from '../../styles/components/dashboardClient/DashboardAddresses.module.css';
import {
  fetchAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from '../../api/addresses';
import AddAddressModal from '../modals/AddAddressModal';
import EditAddressModal from '../modals/EditAddressModal';

export default function DashboardAddresses() {
  const [addresses, setAddresses] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    fetchAddresses()
      .then(setAddresses)
      .catch(console.error);
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteAddress(id);
      setAddresses(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleMakeDefault = async (id) => {
    try {
      await updateAddress(id, { isDefault: true });
      setAddresses(prev =>
        prev.map(a => ({ ...a, isDefault: a.id === id }))
      );
    } catch (error) {
      console.error('Erreur mise à jour par défaut :', error);
    }
  };

  const handleAdd = () => setShowAddModal(true);

  const handleSaveNew = async (newAddress) => {
    try {
      setAddresses(prev => {
        if (newAddress.is_default) {
          const cleared = prev.map(a => ({ ...a, is_default: false }));
          return [...cleared, newAddress];
        }
        return [...prev, newAddress];
      });
      setShowAddModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenEdit = (address) => {
    setSelectedAddress(address);
    setShowEditModal(true);
  };
  const handleCloseEdit = () => {
    setSelectedAddress(null);
    setShowEditModal(false);
  };
  const handleSaveEdit = async (updated) => {
    try {
      const saved = await updateAddress(updated.id, updated);
      setAddresses(prev => {
        if (saved.isDefault) {
          return prev.map(a => a.id === saved.id ? saved : { ...a, isDefault: false });
        }
        return prev.map(a => a.id === saved.id ? saved : a);
      });
      setShowEditModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.addressesContainer}>
      <h3 className={styles.sectionTitle}>Mes adresses</h3>
      <div className={styles.addressesList}>
        {addresses.map(addr => (
          <div key={addr.id} className={styles.addressCard}>
            <div className={styles.cardHeader}>
              <span>{addr.label}</span>
              {addr.is_default && (
                <span className={styles.defaultBadge}>Par défaut</span>
              )}
            </div>
            <div className={styles.cardBody}>
              <address className={styles.addressText}>
                {addr.address1}<br />
                {addr.address2 && <>{addr.address2}<br /></>}
                {addr.postalcode} {addr.city}<br />
                {addr.country}
              </address>
              <div className={styles.actions}>
                {!addr.is_default && (
                  <button
                    className={styles.defaultBtn}
                    onClick={() => handleMakeDefault(addr.id)}
                  >
                    Définir par défaut
                  </button>
                )}
                <button className={styles.editBtn} onClick={() => handleOpenEdit(addr)}>Éditer</button>
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
      <button className={styles.addBtn} onClick={handleAdd}>Ajouter une adresse</button>
      <AddAddressModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveNew}
      />
      <EditAddressModal
        isOpen={showEditModal}
        onClose={handleCloseEdit}
        address={selectedAddress}
        onSave={handleSaveEdit}
      />
    </div>
  );
}
