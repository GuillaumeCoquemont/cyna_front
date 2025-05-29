import React, { useState, useEffect } from 'react';
import { fetchServices } from '../../api/services';
import styles from '../../styles/components/modals/CarouselModal.module.css';

export default function AddCarouselServiceModal({ isOpen, onClose, onSave }) {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ service_id: '', order: '1' });
  const [error, setError] = useState('');

  // Load list of services when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchServices()
        .then(data => setServices(data))
        .catch(err => console.error('Erreur fetchServices:', err));
      setForm({ service_id: '', order: '1' });
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.service_id) {
      setError('Veuillez sélectionner un service');
      return;
    }
    const payload = {
      service_id: parseInt(form.service_id, 10),
      order: parseInt(form.order, 10) || 1
    };
    try {
      await onSave(payload);
      onClose();
      setForm({ service_id: '', order: '1' });
    } catch (err) {
      setError(err.message || 'Ordre déjà utilisé');
    }
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <h3>Ajouter un service au carrousel</h3>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            Service
            <select name="service_id" value={form.service_id} onChange={handleChange} required>
              <option value="">-- Choisir --</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.Name}</option>
              ))}
            </select>
          </label>
          <label>
            Ordre d'affichage
            <input
              type="number"
              name="order"
              value={form.order}
              onChange={handleChange}
              min="1"
              placeholder="Ordre non utilisé"
            />
          </label>
          {error && <p className={styles.errorMessage}>{error}</p>}
          <div className={styles.actions}>
            <button type="button" onClick={onClose}>Annuler</button>
            <button type="submit">Ajouter</button>
          </div>
        </form>
      </div>
    </div>
);
}
