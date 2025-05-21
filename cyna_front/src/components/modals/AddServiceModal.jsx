// src/components/modals/AddServiceModal.jsx

import React, { useState, useEffect } from 'react';
import styles from '../../styles/components/modals/ServiceModal.module.css';
import { fetchServices } from '../../api/services';

const AddServiceModal = ({ isOpen, onClose, onSave }) => {
  const [form, setForm] = useState({
    service_id: '',
    order: '1'
  });
  const [services, setServices] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchServices()
      .then(data => setServices(data))
      .catch(err => console.error('Erreur fetchServices:', err));
  }, []);

  if (!isOpen) return null;

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

const handleSubmit = async e => {
  e.preventDefault();
  if (!form.service_id) {
    setError('Merci de sélectionner un service.');
    return;
  }
  setError('');
  const payload = {
    service_id: parseInt(form.service_id, 10),
    order: parseInt(form.order, 10)
  };
  try {
    await onSave(payload);
  } catch (err) {
    setError(err.message || 'Erreur lors de l’ajout');
    return;
  }
  setForm({
    service_id: '',
    order: '1'
  });
  onClose();
};

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <h3>Ajouter un service</h3>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label>Service*</label>
            <select
              name="service_id"
              value={form.service_id}
              onChange={handleChange}
              required
            >
              <option value="">-- Sélectionner --</option>
              {services.map(service => (
                <option key={service.id} value={service.id}>
                  {service.Name || service.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label>Ordre</label>
            <input
              type="number"
              name="order"
              value={form.order}
              onChange={handleChange}
              min="1"
              placeholder="Ordre non utilisé"
/>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.actions}>
            <button type="button" onClick={onClose}>
              Annuler
            </button>
            <button type="submit">Ajouter</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddServiceModal;