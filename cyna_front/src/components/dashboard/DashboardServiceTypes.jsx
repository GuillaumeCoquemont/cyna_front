import React, { useState, useEffect } from 'react';
import styles from '../../styles/components/dashboardClient/DashboardServiceTypes.module.css';
import {
  fetchServiceTypes,
  addServiceType,
  updateServiceType,
  deleteServiceType,
} from '../../api/serviceTypes';
import AddServiceTypeModal from '../modals/AddServiceTypeModal';
import EditServiceTypeModal from '../modals/EditServiceTypeModal';

export default function DashboardServiceTypes() {
  const [types, setTypes] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    fetchServiceTypes()
      .then(setTypes)
      .catch(console.error);
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteServiceType(id);
      setTypes(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
      window.alert('Impossible de supprimer le type de service');
    }
  };

  const handleOpenEdit = (type) => {
    setSelectedType(type);
    setShowEditModal(true);
  };
  const handleCloseEdit = () => {
    setSelectedType(null);
    setShowEditModal(false);
  };

  const handleSaveNew = async (data) => {
    try {
      const saved = await addServiceType(data);
      setTypes(prev => [...prev, saved]);
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
      window.alert('Erreur lors de la création du type');
    }
  };

  const handleSaveEdit = async (data) => {
    try {
      const saved = await updateServiceType(data.id, data);
      setTypes(prev => prev.map(t => t.id === saved.id ? saved : t));
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
      window.alert('Erreur lors de la modification du type de service');
    }
  };

  return (
    <div className={styles.typesContainer}>
      <h3 className={styles.sectionTitle}>Gestion des types de service</h3>
      <div className={styles.typesList}>
        {types.map(t => (
          <div key={t.id} className={styles.typeCard}>
            <div className={styles.cardHeader}>
              <span>{t.Name}</span>
            </div>
            <div className={styles.cardBody}>
              <p>{t.Description}</p>
              <button className={styles.editBtn} onClick={() => handleOpenEdit(t)}>Modifier</button>
              <button className={styles.deleteBtn} onClick={() => handleDelete(t.id)}>Supprimer</button>
            </div>
          </div>
        ))}
      </div>
      <button className={styles.addBtn} onClick={() => setShowAddModal(true)}>Ajouter un type</button>
      <AddServiceTypeModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveNew}
      />
      <EditServiceTypeModal
        isOpen={showEditModal}
        onClose={handleCloseEdit}
        serviceType={selectedType}
        onSave={handleSaveEdit}
      />
    </div>
  );
}