import React, { useState, useEffect } from 'react';
import { addAddress } from '../../api/addresses';
import styles from '../../styles/components/modals/AddAddressModal.module.css';

export default function AddAddressModal({ isOpen, onClose, onSave }) {
  const [form, setForm] = useState({
    label: '',
    line1: '',
    city: '',
    zip: '',
    country: '',
    isDefault: false,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setForm({
        label: '',
        line1: '',
        city: '',
        zip: '',
        country: '',
        isDefault: false,
      });
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = e => {
    const { name, value, type: inputType, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: inputType === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.label.trim() || !form.line1.trim() || !form.city.trim() || !form.zip.trim() || !form.country.trim()) {
      setError('Tous les champs marqués * sont requis.');
      return;
    }
    setError('');
    try {
      console.log('handleSubmit calling addAddress with:', form);
      const saved = await addAddress(form);
      console.log('API addAddress returned:', saved);
      onSave(saved);
      onClose();
    } catch (err) {
      console.error('API error adding address:', err);
      setError("Erreur lors de la sauvegarde de l'adresse.");
    }
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <h3>Ajouter une adresse</h3>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label>Label *</label>
            <input
              type="text"
              name="label"
              value={form.label}
              onChange={handleChange}
              placeholder="Domicile, Travail…"
              required
            />
          </div>
          <div className={styles.field}>
            <label>Adresse ligne 1 *</label>
            <input
              type="text"
              name="line1"
              value={form.line1}
              onChange={handleChange}
              placeholder="123 Rue…"
              required
            />
          </div>
          <div className={styles.field}>
            <label>Ville *</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Paris"
              required
            />
          </div>
          <div className={styles.field}>
            <label>Code postal *</label>
            <input
              type="text"
              name="zip"
              value={form.zip}
              onChange={handleChange}
              placeholder="75000"
              required
            />
          </div>
          <div className={styles.field}>
            <label>Pays *</label>
            <input
              type="text"
              name="country"
              value={form.country}
              onChange={handleChange}
              placeholder="France"
              required
            />
          </div>
          <div className={styles.fieldCheckbox}>
            <input
              type="checkbox"
              name="isDefault"
              checked={form.isDefault}
              onChange={handleChange}
              id="defaultAddress"
            />
            <label htmlFor="defaultAddress">Définir par défaut</label>
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