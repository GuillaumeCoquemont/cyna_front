import React, { useState, useEffect } from 'react';
import styles from '../../styles/components/dashboardClient/DashboardCategories.module.css';
import {
  fetchCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  checkProductCategoryDependencies
} from '../../api/categories';
import {
  fetchServiceTypes,
  addServiceType,
  updateServiceType,
  deleteServiceType,
  checkServiceTypeDependencies
} from '../../api/serviceTypes';
import AddCategoryModal from '../modals/AddCategoryModal';
import EditCategoryModal from '../modals/EditCategoryModal';
import AddServiceTypeModal from '../modals/AddServiceTypeModal';
import EditServiceTypeModal from '../modals/EditServiceTypeModal';
import DeleteConfirmationModal from '../modals/DeleteConfirmationModal';

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

  // Modale de suppression pour les catégories
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    category: null,
    dependencies: null,
    isLoading: false
  });

  // Modale de suppression pour les types de services
  const [deleteTypeModal, setDeleteTypeModal] = useState({
    isOpen: false,
    serviceType: null,
    dependencies: null,
    isLoading: false
  });

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

  const handleDelete = async (category) => {
    try {
      // Ouvrir la modale avec état de chargement
      setDeleteModal({
        isOpen: true,
        category,
        dependencies: null,
        isLoading: true
      });

      // Vérifier les dépendances
      const dependencies = await checkProductCategoryDependencies(category.id);
      
      // Mettre à jour la modale avec les dépendances
      setDeleteModal({
        isOpen: true,
        category,
        dependencies,
        isLoading: false
      });
    } catch (err) {
      console.error('Erreur vérification dépendances:', err);
      setDeleteModal({ isOpen: false, category: null, dependencies: null, isLoading: false });
      alert('Erreur lors de la vérification des dépendances');
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteCategory(deleteModal.category.id);
      setCategories(prev => prev.filter(cat => cat.id !== deleteModal.category.id));
      closeDeleteModal();
    } catch (err) {
      console.error('Erreur suppression catégorie:', err);
      alert('Erreur lors de la suppression de la catégorie');
    }
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, category: null, dependencies: null, isLoading: false });
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
  const handleDeleteType = async (serviceType) => {
    try {
      setDeleteTypeModal({
        isOpen: true,
        serviceType,
        dependencies: null,
        isLoading: true
      });

      const dependencies = await checkServiceTypeDependencies(serviceType.id);
      
      setDeleteTypeModal({
        isOpen: true,
        serviceType,
        dependencies,
        isLoading: false
      });
    } catch (err) {
      console.error('Erreur vérification dépendances:', err);
      setDeleteTypeModal({ isOpen: false, serviceType: null, dependencies: null, isLoading: false });
      alert('Erreur lors de la vérification des dépendances');
    }
  };

  const confirmDeleteType = async () => {
    try {
      await deleteServiceType(deleteTypeModal.serviceType.id);
      setServiceTypes(prev => prev.filter(type => type.id !== deleteTypeModal.serviceType.id));
      closeDeleteTypeModal();
    } catch (err) {
      console.error('Erreur suppression type:', err);
      
      // Gérer l'erreur de suppression impossible
      if (err.message.includes('400')) {
        alert('❌ Suppression impossible : Ce type est encore utilisé par des services.\n\n💡 Déplacez d\'abord ces services vers un autre type.');
      } else {
        alert('Erreur lors de la suppression du type de service');
      }
    }
  };

  const closeDeleteTypeModal = () => {
    setDeleteTypeModal({ isOpen: false, serviceType: null, dependencies: null, isLoading: false });
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
              <p>{c.description}</p>
              <button className={styles.editBtn} onClick={() => handleOpenEdit(c)}>Modifier</button>
              <button className={styles.deleteBtn} onClick={() => handleDelete(c)}>Supprimer</button>
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
              <span>{t.name}</span>
            </div>
            <div className={styles.cardBody}>
              <p>{t.description}</p>
              <button className={styles.editBtn} onClick={() => handleOpenEditType(t)}>Modifier</button>
              <button className={styles.deleteBtn} onClick={() => handleDeleteType(t)}>Supprimer</button>
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

      {/* Modale de suppression pour les catégories */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        itemName={deleteModal.category?.name}
        itemType="la catégorie"
        dependencies={deleteModal.dependencies}
        isLoading={deleteModal.isLoading}
      />

      {/* Modale de suppression pour les types de services */}
      <DeleteConfirmationModal
        isOpen={deleteTypeModal.isOpen}
        onClose={closeDeleteTypeModal}
        onConfirm={confirmDeleteType}
        itemName={deleteTypeModal.serviceType?.name}
        itemType="le type de service"
        dependencies={deleteTypeModal.dependencies}
        isLoading={deleteTypeModal.isLoading}
      />
    </div>
  );
}