import React, { useState, useEffect } from 'react';
import { fetchServiceTypes } from '../../api/serviceTypes';
import styles from '../../styles/components/modals/ServiceModal.module.css';

export default function EditServiceModal({ isOpen, onClose, onSave, service }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    status: false,
    price: '',
    subscription: false,
    subscriptionType: '',
    userCount: '',
    promotion: '',
    service_type_id: ''
  });
  const [serviceTypes, setServiceTypes] = useState([]);

  useEffect(() => {
    if (service) {
      setForm({
        name: service.name || '',
        description: service.description || '',
        status: service.status || false,
        price: service.price || '',
        subscription: service.subscription || false,
        subscriptionType: service.subscriptionType || '',
        userCount: service.userCount || '',
        promotion: service.promotion || '',
        service_type_id: service.service_type_id || ''
      });
    }
  }, [service]);

  useEffect(() => {
    fetchServiceTypes()
      .then(setServiceTypes)
      .catch(() => setServiceTypes([]));
  }, []);

  if (!isOpen) return null;

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSave({ ...form, id: service.id }); // Ajoute l'id pour l'update
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <h3>Modifier le service</h3>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label>Nom *</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.field}>
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </div>
          <div className={styles.field}>
            <label>Statut *</label>
            <select
              name="status"
              value={form.status ? "true" : "false"}
              onChange={e =>
                setForm(prev => ({
                  ...prev,
                  status: e.target.value === "true"
                }))
              }
              required
            >
              <option value="true">En service</option>
              <option value="false">Hors service</option>
            </select>
          </div>
          <div className={styles.field}>
            <label>Prix *</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.fieldCheckbox}>
            <label>
              <input
                type="checkbox"
                name="subscription"
                checked={form.subscription}
                onChange={handleChange}
              />
              Abonnement
            </label>
          </div>
          {form.subscription && (
            <div className={styles.field}>
              <label>Type d'abonnement</label>
              <input
                type="text"
                name="subscriptionType"
                value={form.subscriptionType}
                onChange={handleChange}
              />
            </div>
          )}
          <div className={styles.field}>
            <label>Nombre d'utilisateurs</label>
            <input
              type="number"
              name="userCount"
              value={form.userCount}
              onChange={handleChange}
            />
          </div>
          <div className={styles.field}>
            <label>Promotion</label>
            <input
              type="text"
              name="promotion"
              value={form.promotion}
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
                  {st.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.actions}>
            <button type="button" onClick={onClose}>Annuler</button>
            <button type="submit">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  );
}