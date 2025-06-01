// src/components/modals/EditServiceTypeModal.jsx
import React, { useState, useEffect } from 'react';
import styles from '../../styles/components/modals/ServiceTypeModal.module.css';

export default function EditServiceTypeModal({ isOpen, onClose, serviceType, onSave }) {
  const [form, setForm] = useState({ id: '', name: '', description: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && serviceType) {
      setForm({
        id: serviceType.id,
        name: serviceType.name,
        description: serviceType.description
      });
      setError('');
    }
  }, [isOpen, serviceType]);

  if (!isOpen) return null;

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Le nom est requis.');
      return;
    }
    setError('');
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setError(err.message || 'Erreur lors de la modification du type.');
    }
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <h3>Modifier un type de service</h3>
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
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.actions}>
            <button type="button" onClick={onClose}>Annuler</button>
            <button type="submit">Modifier</button>
          </div>
        </form>
      </div>
    </div>
  );
}