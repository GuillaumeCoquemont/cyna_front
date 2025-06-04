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

export default function DashboardServices() {
  const [services, setServices] = useState([]);
  const [tableServices, setTableServices] = useState([]);
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
  const handleUpdate = async (updatedService) => {
    await updateService(updatedService.id, updatedService);
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
    await addService(newServiceData);
    load(); // recharge la liste depuis la BDD
    handleCloseAdd();
  };

  return (
    <div className={styles.editorContainer}>
      <h2>Éditeur de Services</h2>
      <button onClick={handleOpenAdd} className={styles.addButton}>
        Ajouter un service
      </button>
      <h3>Récapitulatif des services</h3>
      <table className={styles.summaryTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Description</th>
            <th>Prix</th>
            <th>Prix après remise</th>
            <th>Code promo</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tableServices.map(s => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>{s.description}</td>
              <td>{s.price} €</td>
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
                    {s.promoCode.code} ({s.promoCode.discountType === 'percentage'
                      ? `${s.promoCode.discountValue}%`
                      : `${s.promoCode.discountValue}€`
                    })
                  </span>
                ) : (
                  '—'
                )}
              </td>
              <td>{s.status ? 'Actif' : 'Inactif'}</td>
              <td>
                <button onClick={() => handleOpenEdit(s)}>Modifier</button>
                <button onClick={() => handleDelete(s)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <EditServiceModal
        isOpen={showEditModal}
        onClose={handleCloseEdit}
        service={selectedService}
        onSave={handleUpdate}
      />
      <AddServiceModal
        isOpen={showAddModal}
        onClose={handleCloseAdd}
        onSave={handleAdd}
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