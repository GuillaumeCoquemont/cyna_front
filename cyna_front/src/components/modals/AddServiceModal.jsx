// src/components/modals/AddServiceModal.jsx

import React, { useState, useEffect } from 'react';
import { addService } from '../../api/services';
import { fetchServiceTypes } from '../../api/serviceTypes';
import styles from '../../styles/components/modals/ServiceModal.module.css';

export default function AddServiceModal({ isOpen, onClose, onSave }) {
  const [form, setForm] = useState({
    Name: '',
    Description: '',
    Status: false,
    Price: '',
    Subscription: false,
    SubscriptionType: '',
    UserCount: '',
    Promotion: '',
    service_type_id: ''
  });
  const [serviceTypes, setServiceTypes] = useState([]);
  const [error, setError] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setForm({
        Name: '',
        Description: '',
        Status: false,
        Price: '',
        Subscription: false,
        SubscriptionType: '',
        UserCount: '',
        Promotion: '',
        service_type_id: ''
      });
      setError('');
    }
  }, [isOpen]);

  // Load service types for the dropdown
  useEffect(() => {
    fetchServiceTypes()
      .then(data => setServiceTypes(data))
      .catch(console.error);
  }, []);

  if (!isOpen) return null;

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    // Validate required fields
    if (!form.Name.trim() || !form.service_type_id) {
      setError('Le nom et le type de service sont requis.');
      return;
    }
    setError('');
    try {
      const payload = {
        Name: form.Name,
        Description: form.Description,
        Status: form.Status,
        Price: parseFloat(form.Price) || 0,
        Subscription: form.Subscription,
        SubscriptionType: form.SubscriptionType,
        UserCount: parseInt(form.UserCount, 10) || 0,
        Promotion: form.Promotion,
        service_type_id: parseInt(form.service_type_id, 10)
      };
      const saved = await addService(payload);
      onSave(saved);
      onClose();
    } catch (err) {
      console.error('API error adding service:', err);
      setError('Erreur lors de la sauvegarde du service.');
    }
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <h3>Ajouter un service</h3>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label>Nom *</label>
            <input
              type="text"
              name="Name"
              value={form.Name}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.field}>
            <label>Description</label>
            <textarea
              name="Description"
              value={form.Description}
              onChange={handleChange}
            />
          </div>
          <div className={styles.fieldCheckbox}>
            <label>
              <input
                type="checkbox"
                name="Status"
                checked={form.Status}
                onChange={handleChange}
              />
              Actif
            </label>
          </div>
          <div className={styles.field}>
            <label>Prix *</label>
            <input
              type="number"
              name="Price"
              value={form.Price}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.fieldCheckbox}>
            <label>
              <input
                type="checkbox"
                name="Subscription"
                checked={form.Subscription}
                onChange={handleChange}
              />
              Abonnement
            </label>
          </div>
          {form.Subscription && (
            <div className={styles.field}>
              <label>Type d'abonnement</label>
              <input
                type="text"
                name="SubscriptionType"
                value={form.SubscriptionType}
                onChange={handleChange}
              />
            </div>
          )}
          <div className={styles.field}>
            <label>Nombre d'utilisateurs</label>
            <input
              type="number"
              name="UserCount"
              value={form.UserCount}
              onChange={handleChange}
            />
          </div>
          <div className={styles.field}>
            <label>Promotion</label>
            <input
              type="text"
              name="Promotion"
              value={form.Promotion}
              onChange={handleChange}
            />
          </div>
          <div className={styles.field}>
            <label>Type de service *</label>
            <select
              name="service_type_id"
              value={form.service_type_id}
              onChange={handleChange}
              required
            >
              <option value="">-- Sélectionner --</option>
              {serviceTypes.map(st => (
                <option key={st.id} value={st.id}>
                  {st.Name}
                </option>
              ))}
            </select>
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.actions}>
            <button type="button" onClick={onClose}>Annuler</button>
            <button type="submit">Ajouter</button>
          </div>
        </form>
      </div>
    </div>
  );
}