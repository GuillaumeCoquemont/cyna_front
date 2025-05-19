import React, { useState, useEffect } from 'react';
import styles from '../../styles/components/dashboard/DashboardServices.module.css';
import { fetchServices, updateService, deleteService, addService } from '../../api/services';
import EditServiceModal from '../modals/EditServiceModal';
import AddServiceModal from '../modals/AddServiceModal';

const DashboardServices = () => {
  const [services, setServices] = useState([]);
  const [allKeys, setAllKeys] = useState([]);
  const [newService, setNewService] = useState({ key: '', title: '', subtitle: '', description: '', image: '' });

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleOpenEdit = (svc) => { setSelectedService(svc); setShowEditModal(true); };
  const handleCloseEdit = () => { setSelectedService(null); setShowEditModal(false); };

  const handleOpenAdd = () => setShowAddModal(true);
  const handleCloseAdd = () => setShowAddModal(false);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = () => {
    fetchServices()
      .then(data => {
        setServices(data);
        setAllKeys(data.map(s => s.key));
      })
      .catch(err => console.error('Erreur chargement services:', err));
  };

  const handleChange = (key, field, value) => {
    setServices(prev =>
      prev.map(s => (s.key === key ? { ...s, [field]: value } : s))
    );
  };

  const handleSave = async (key) => {
    const updated = services.find(s => s.key === key);
    try {
      const saved = await updateService(key, updated);
      setServices(prev => prev.map(s => (s.key === saved.key ? saved : s)));
      window.alert('Service mis à jour');
    } catch (err) {
      console.error('Erreur mise à jour service:', err);
      window.alert('Impossible de sauvegarder le service');
    }
  };

  const handleDelete = async (key) => {
    try {
      await deleteService(key);
      setServices(prev => prev.filter(s => s.key !== key));
    } catch (err) {
      console.error('Erreur suppression service:', err);
    }
  };

  const handleAdd = async () => {
    if (!newService.key) return;
    try {
      const saved = await addService(newService);
      setServices(prev => [...prev, saved]);
      setNewService({ key: '', title: '', subtitle: '', description: '', image: '' });
    } catch (err) {
      console.error('Erreur ajout service:', err);
    }
  };

  return (
    <div className={styles.editorContainer}>
      <h2>Gestion des services</h2>
      <button onClick={handleOpenAdd} className={styles.addButton}>
        Ajouter un service
      </button>
      <h3>Récapitulatif des services</h3>
      <table className={styles.summaryTable}>
        <thead>
          <tr>
            <th>Key</th>
            <th>Titre</th>
            <th>Sous-titre</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map(s => (
            <tr key={s.key}>
              <td>{s.key}</td>
              <td>{s.title}</td>
              <td>{s.subtitle}</td>
              <td>
                <button onClick={() => handleOpenEdit(s)}>Modifier</button>
                <button onClick={() => handleDelete(s.key)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <EditServiceModal
        isOpen={showEditModal}
        onClose={handleCloseEdit}
        service={selectedService}
        onSave={handleSave}
      />
      <AddServiceModal
        isOpen={showAddModal}
        onClose={handleCloseAdd}
        onSave={handleAdd}
        existingKeys={allKeys}
      />
    </div>
  );
};

export default DashboardServices;