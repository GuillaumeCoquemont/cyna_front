import React, { useState, useEffect } from 'react';
import styles from '../../styles/components/dashboard/DashboardServices.module.css';
import {
  fetchServices,
  addService,
  updateService,
  deleteService,
  checkServiceDependencies
} from '../../api/services';
import { calculateDiscountedPrice, formatPrice } from '../../utils/priceUtils';

import EditServiceModal from '../modals/EditServiceModal';
import AddServiceModal from '../modals/AddServiceModal';
import DeleteConfirmationModal from '../modals/DeleteConfirmationModal';

const STATIC_URL = process.env.REACT_APP_STATIC_URL || process.env.REACT_APP_API_URL || 'http://localhost:3007';

export default function DashboardServices({ onServiceChange }) {
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
    if (onServiceChange) {
      onServiceChange(); // Notifie le parent pour rafraîchir le dashboard
    }
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
      if (onServiceChange) {
        onServiceChange(); // Notifie le parent pour rafraîchir le dashboard
      }
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
    if (onServiceChange) {
      onServiceChange(); // Notifie le parent pour rafraîchir le dashboard
    }
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
      <h2>Éditeur de Services</h2>
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
        <button onClick={handleOpenAdd} className={styles.addButton}>
          Ajouter un service
        </button>
      </div>
      <h3>Récapitulatif des services</h3>
      <table className={styles.summaryTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Nom</th>
            <th>Description</th>
            <th>Prix</th>
            <th>Prix après remise</th>
            <th>Code promo</th>
            <th>Type</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredServices.map(s => {
            return (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>
                  {s.image ? (
                    <img
                      src={s.image.startsWith('/uploads/')
                        ? `${STATIC_URL}${s.image}`
                        : (() => {
                            try {
                              return require(`../../assets/images/services/${s.image}`);
                            } catch (err) {
                              console.error(`Image introuvable : ${s.image}`, err);
                              return 'https://placehold.co/80x80?text=Image+non+disponible';
                            }
                          })()}
                      alt={s.name}
                      style={{ maxWidth: 80, maxHeight: 80, objectFit: 'cover' }}
                      onError={(e) => {
                        console.error('Erreur de chargement de l\'image:', s.image);
                        e.target.src = 'https://placehold.co/80x80?text=Image+non+disponible';
                      }}
                    />
                  ) : (
                    <span>Image non disponible</span>
                  )}
                </td>
                <td>{s.name}</td>
                <td>{s.description}</td>
                <td>{formatPrice(s.price)}</td>
                <td>
                  {s.promoCode ? (
                    <span style={{ color: 'var(--tertiary-color)' }}>
                      {formatPrice(calculateDiscountedPrice(s.price, s.promoCode))}
                    </span>
                  ) : (
                    formatPrice(s.price)
                  )}
                </td>
                <td>
                  {s.promoCode ? (
                    <span>
                      {s.promoCode.code} ({(s.promoCode.discount_type || s.promoCode.discountType) === 'percentage' ? 
                        `${s.promoCode.discount_value || s.promoCode.discountValue}%` : 
                        `${s.promoCode.discount_value || s.promoCode.discountValue}€`})
                    </span>
                  ) : (
                    '—'
                  )}
                </td>
                <td>
                  {s.subscription ? 'Abonnement' : 'Service ponctuel'}
                </td>
                <td>
                  {s.status ? 'Actif' : 'Inactif'}
                </td>
                <td>
                  <button onClick={() => handleOpenEdit(s)}>Modifier</button>
                  <button onClick={() => handleDelete(s)}>Supprimer</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
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