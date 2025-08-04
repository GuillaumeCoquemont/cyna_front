import React, { useState, useEffect } from 'react';
import { addAddress } from '../../api/addresses';
import styles from '../../styles/components/modals/AddAddressModal.module.css';

export default function AddAddressModal({ isOpen, onClose, onSave }) {
  const [form, setForm] = useState({
    label: '',
    address1: '',
    line2: '',
    city: '',
    postalcode: '',
    region: '',
    country: '',
    is_default: false,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setForm({
        label: '',
        address1: '',
        line2: '',
        city: '',
        postalcode: '',
        region: '',
        country: '',
        is_default: false,
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
    if (!form.address1.trim() || !form.city.trim() || !form.postalcode.trim() || !form.country.trim()) {
      setError('Tous les champs marqués * sont requis.');
      return;
    }
    setError('');
    try {
      const payload = {
        label: form.label,
        address1: form.address1,
        line2: form.line2,
        city: form.city,
        postalcode: form.postalcode,
        region: form.region,
        country: form.country,
        is_default: form.is_default,
      };
      console.log('handleSubmit calling addAddress with:', payload);
      const saved = await addAddress(payload);
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
            <label>Label</label>
            <input
              type="text"
              name="label"
              value={form.label}
              onChange={handleChange}
              placeholder="Domicile, Travail…"
            />
          </div>
          <div className={styles.field}>
            <label>Adresse ligne 1 *</label>
            <input
              type="text"
              name="address1"
              value={form.address1}
              onChange={handleChange}
              placeholder="123 Rue…"
              required
            />
          </div>
          <div className={styles.field}>
            <label>Adresse ligne 2</label>
            <input
              type="text"
              name="line2"
              value={form.line2}
              onChange={handleChange}
              placeholder="Complément d'adresse"
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
              name="postalcode"
              value={form.postalcode}
              onChange={handleChange}
              placeholder="75000"
              required
            />
          </div>
          <div className={styles.field}>
            <label>Région</label>
            <input
              type="text"
              name="region"
              value={form.region}
              onChange={handleChange}
              placeholder="Île-de-France"
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
              name="is_default"
              checked={form.is_default}
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