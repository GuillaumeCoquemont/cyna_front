import React, { useState, useEffect } from 'react';
import styles from '../../styles/components/dashboardClient/DashboardCategories.module.css';
import {
  fetchCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from '../../api/categories';
import {
  fetchServiceTypes,
  addServiceType,
  updateServiceType,
  deleteServiceType,
} from '../../api/serviceTypes';
import AddCategoryModal from '../modals/AddCategoryModal';
import EditCategoryModal from '../modals/EditCategoryModal';
import AddServiceTypeModal from '../modals/AddServiceTypeModal';
import EditServiceTypeModal from '../modals/EditServiceTypeModal';

export default function DashboardCategories() {
  const [categories, setCategories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Service types
  const [serviceTypes, setServiceTypes] = useState([]);
  const [showAddTypeModal, setShowAddTypeModal] = useState(false);
  const [showEditTypeModal, setShowEditTypeModal] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetchServiceTypes()
      .then(setServiceTypes)
      .catch(console.error);
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error(err);
      window.alert('Impossible de supprimer la catégorie');
    }
  };

  const handleOpenEdit = (category) => {
    setSelectedCategory(category);
    setShowEditModal(true);
  };
  const handleCloseEdit = () => {
    setSelectedCategory(null);
    setShowEditModal(false);
  };

  const handleSaveNew = async (data) => {
    try {
      const saved = await addCategory(data);
      setCategories(prev => [...prev, saved]);
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
      window.alert('Erreur lors de la création de la catégorie');
    }
  };

  const handleSaveEdit = async (data) => {
    try {
      const saved = await updateCategory(data.id, data);
      setCategories(prev => prev.map(c => c.id === saved.id ? saved : c));
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
      window.alert('Erreur lors de la modification de la catégorie');
    }
  };

  const handleOpenAdd = () => setShowAddModal(true);
  const handleCloseAdd = () => setShowAddModal(false);

  // Service type handlers
  const handleDeleteType = async (id) => {
    try {
      await deleteServiceType(id);
      setServiceTypes(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
      window.alert('Impossible de supprimer le type de service');
    }
  };

  const handleOpenEditType = (type) => {
    setSelectedType(type);
    setShowEditTypeModal(true);
  };
  const handleCloseEditType = () => {
    setSelectedType(null);
    setShowEditTypeModal(false);
  };

  const handleSaveNewType = async (data) => {
    try {
      const saved = await addServiceType(data);
      setServiceTypes(prev => [...prev, saved]);
      setShowAddTypeModal(false);
    } catch (err) {
      console.error(err);
      window.alert('Erreur lors de la création du type de service');
    }
  };

  const handleSaveEditType = async (data) => {
    try {
      const saved = await updateServiceType(data.id, data);
      setServiceTypes(prev => prev.map(t => t.id === saved.id ? saved : t));
      setShowEditTypeModal(false);
    } catch (err) {
      console.error(err);
      window.alert('Erreur lors de la modification du type de service');
    }
  };

  return (
    <div className={styles.categoriesContainer}>
      <div className={styles.categoriesSection}>
      <h3 className={styles.sectionTitle}>Gestion des catégories</h3>
      <div className={styles.categoriesList}>
        {categories.map(c => (
          <div key={c.id} className={styles.categoryCard}>
            <div className={styles.cardHeader}>
              <span>{c.name}</span>
            </div>
            <div className={styles.cardBody}>
              <p>{c.description}</p> {/* <-- ici, pas Description */}
              <button className={styles.editBtn} onClick={() => handleOpenEdit(c)}>Modifier</button>
              <button className={styles.deleteBtn} onClick={() => handleDelete(c.id)}>Supprimer</button>
            </div>
          </div>
        ))}
      </div>
      <button className={styles.addBtn} onClick={handleOpenAdd}>Ajouter une catégorie</button>
      <AddCategoryModal
        isOpen={showAddModal}
        onClose={handleCloseAdd}
        onSave={handleSaveNew}
      />
      <EditCategoryModal
        isOpen={showEditModal}
        onClose={handleCloseEdit}
        category={selectedCategory}
        onSave={handleSaveEdit}
      />
      </div>

      <div className={styles.serviceTypesSection}>
      <h3 className={styles.sectionTitle}>Gestion des types de service</h3>
      <div className={styles.categoriesList}>
        {serviceTypes.map(t => (
          <div key={t.id} className={styles.categoryCard}>
            <div className={styles.cardHeader}>
              <span>{t.Name}</span>
            </div>
            <div className={styles.cardBody}>
              <p>{t.Description}</p>
              <button className={styles.editBtn} onClick={() => handleOpenEditType(t)}>Modifier</button>
              <button className={styles.deleteBtn} onClick={() => handleDeleteType(t.id)}>Supprimer</button>
            </div>
          </div>
        ))}
      </div>
      <button className={styles.addBtn} onClick={() => setShowAddTypeModal(true)}>Ajouter un type de service</button>
      <AddServiceTypeModal
        isOpen={showAddTypeModal}
        onClose={() => setShowAddTypeModal(false)}
        onSave={handleSaveNewType}
      />
      <EditServiceTypeModal
        isOpen={showEditTypeModal}
        onClose={handleCloseEditType}
        serviceType={selectedType}
        onSave={handleSaveEditType}
      />
      </div>
    </div>
  );
}