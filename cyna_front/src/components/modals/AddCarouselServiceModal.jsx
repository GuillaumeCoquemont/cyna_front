import React, { useState, useEffect } from 'react';
import { fetchServices } from '../../api/services';
import styles from '../../styles/components/modals/CarouselModal.module.css';

export default function AddCarouselServiceModal({ isOpen, onClose, onSave }) {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ service_id: '' });
  const [error, setError] = useState('');

  // Load list of services when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchServices()
        .then(data => setServices(data))
        .catch(err => console.error('Erreur fetchServices:', err));
      setForm({ service_id: '' });
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
    try {
      await onSave({ service_id: form.service_id });
      onClose();
      setForm({ service_id: '' });
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'ajout');
    }
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <h3>Ajouter un service au carrousel</h3>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles['form-group']}>
            <label>Service</label>
            <div className="selectWrapper">
              <select 
                className="select"
                name="service_id" 
                value={form.service_id} 
                onChange={handleChange} 
                required
              >
                <option value="">Sélectionner un service</option>
                {services.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
              <span className="selectIcon">▼</span>
            </div>
          </div>
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
