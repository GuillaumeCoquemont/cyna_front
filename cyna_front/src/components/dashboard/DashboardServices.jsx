import React, { useState, useEffect } from 'react';
import styles from '../../styles/components/dashboard/DashboardServices.module.css';
import {
  fetchServices,
  addService,
  updateService,
  deleteService
} from '../../api/services';

import EditServiceModal from '../modals/EditServiceModal';
import AddServiceModal from '../modals/AddServiceModal';

export default function DashboardServices() {
  const [services, setServices] = useState([]);
  const [tableServices, setTableServices] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

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
  const handleDelete = async id => {
    try {
      await deleteService(id);
      setServices(s => s.filter(service => service.id !== id));
      setTableServices(prev => prev.filter(service => service.id !== id));
    } catch (err) {
      console.error('Erreur suppression service:', err);
      alert('Erreur lors de la suppression du service');
    }
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
              <td>{s.status ? 'Actif' : 'Inactif'}</td>
              <td>
                <button onClick={() => handleOpenEdit(s)}>Modifier</button>
                <button onClick={() => handleDelete(s.id)}>Supprimer</button>
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
    </div>
  );
}