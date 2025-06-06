import React, { useState, useEffect } from 'react';
import styles from '../../styles/components/dashboard/DashboardServices.module.css';
import {
  fetchServices,
  addService,
  updateService,
  deleteService,
  checkServiceDependencies
} from '../../api/services';

import EditServiceModal from '../modals/EditServiceModal';
import AddServiceModal from '../modals/AddServiceModal';
import DeleteConfirmationModal from '../modals/DeleteConfirmationModal';

const STATIC_URL = process.env.REACT_APP_STATIC_URL || process.env.REACT_APP_API_URL || 'http://localhost:3007';

export default function DashboardServices() {
  const [services, setServices] = useState([]);
  const [tableServices, setTableServices] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    service: null,
    dependencies: null,
    isLoading: false
  });

  useEffect(() => {
    load();
  }, []);

  const load = () => {
    fetchServices()
      .then(data => {
        console.log('Services data:', data);
        setServices(data);
        setTableServices(data);
      })
      .catch(err => console.error('Erreur chargement services:', err));
  };

  const handleOpenEdit = (service) => {
    setSelectedService(service);
    setShowEditModal(true);
  };
  const handleCloseEdit = () => {
    setSelectedService(null);
    setShowEditModal(false);
  };
  const handleUpdate = async (updatedService, isMultipart) => {
    await updateService(updatedService, isMultipart);
    load();
    handleCloseEdit();
  };
  const handleDelete = async (service) => {
    try {
      setDeleteModal({
        isOpen: true,
        service,
        dependencies: null,
        isLoading: true
      });

      const dependencies = await checkServiceDependencies(service.id);
      
      setDeleteModal({
        isOpen: true,
        service,
        dependencies,
        isLoading: false
      });
    } catch (err) {
      console.error('Erreur vérification dépendances:', err);
      setDeleteModal({ isOpen: false, service: null, dependencies: null, isLoading: false });
      alert('Erreur lors de la vérification des dépendances');
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteService(deleteModal.service.id);
      setServices(s => s.filter(svc => svc.id !== deleteModal.service.id));
      setTableServices(prev => prev.filter(svc => svc.id !== deleteModal.service.id));
      closeDeleteModal();
    } catch (err) {
      console.error('Erreur suppression service:', err);
      alert('Erreur lors de la suppression du service');
    }
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, service: null, dependencies: null, isLoading: false });
  };

  const handleOpenAdd = () => setShowAddModal(true);
  const handleCloseAdd = () => setShowAddModal(false);
  const handleAdd = async (newServiceData) => {
    await addService(newServiceData, true);
    load(); // recharge la liste depuis la BDD
    handleCloseAdd();
  };

  const filteredServices = tableServices.filter(service => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'active') return service.status;
    if (filterStatus === 'inactive') return !service.status;
    return true;
  });

  return (
    <div className={styles.editorContainer}>
      <div className={styles.sectionHeader}>
        <h2>Éditeur de Services</h2>
        <button className={styles.addButton} onClick={handleOpenAdd}>Ajouter un service</button>
      </div>
      <div className={styles.filtersContainer}>
        <div className="selectWrapper">
          <select 
            className="select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tous les services</option>
            <option value="active">Services actifs</option>
            <option value="inactive">Services inactifs</option>
          </select>
          <span className="selectIcon">▼</span>
        </div>
      </div>
      <div className={styles.servicesList}>
        {services.map(s => (
          <div key={s.id} className={styles.serviceCard}>
            <div className={styles.serviceImage}>
              {s.image ? (
                <img 
                  src={s.image.startsWith('/uploads/') ? `${STATIC_URL}${s.image}` : s.image}
                  alt={s.name} 
                  onError={(e) => {
                    console.error('Erreur de chargement de l\'image:', s.image);
                    e.target.src = '/placeholder-image.jpg';
                  }}
                />
              ) : (
                <div className={styles.noImage}>Pas d'image</div>
              )}
            </div>
            <div className={styles.serviceInfo}>
              <h3>{s.name}</h3>
              <p>{s.description}</p>
              <div className={styles.serviceDetails}>
                <span className={styles.price}>{s.price}€</span>
              </div>
              <div className={styles.serviceActions}>
                <button onClick={() => handleOpenEdit(s)}>Modifier</button>
                <button onClick={() => handleDelete(s)}>Supprimer</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <AddServiceModal
        isOpen={showAddModal}
        onClose={handleCloseAdd}
        onSave={handleAdd}
      />
      <EditServiceModal
        isOpen={showEditModal}
        onClose={handleCloseEdit}
        service={selectedService}
        onSave={handleUpdate}
      />
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        itemName={deleteModal.service?.name}
        itemType="le service"
        dependencies={deleteModal.dependencies}
        isLoading={deleteModal.isLoading}
      />
    </div>
  );
}