import React, { useState, useEffect } from 'react';
import { updateAddress } from '../../api/addresses';
import styles from '../../styles/components/modals/EditAddressModal.module.css';

export default function EditAddressModal({ isOpen, onClose, address, onSave }) {
  const [form, setForm] = useState({
    id: address?.id || '',
    label: address?.label || '',
    address1: address?.address1 || '',
    city: address?.city || '',
    postalcode: address?.postalcode || '',
    country: address?.country || '',
    is_default: address?.is_default || false,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (address) {
      setForm({
        id: address.id,
        label: address.label,
        address1: address.address1,
        city: address.city,
        postalcode: address.postalcode,
        country: address.country,
        is_default: address.is_default,
      });
    }
  }, [address]);

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
    if (!form.label.trim() || !form.address1.trim() || !form.city.trim() || !form.postalcode.trim() || !form.country.trim()) {
      setError('Tous les champs marqués * sont requis.');
      return;
    }
    setError('');
    try {
      console.log('handleSubmit calling updateAddress with:', form);
      const saved = await updateAddress(form.id, form);
      console.log('API updateAddress returned:', saved);
      onSave(saved);
      onClose();
    } catch (err) {
      console.error('API error updating address:', err);
      setError("Erreur lors de la mise à jour de l'adresse.");
    }
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <h3>Modifier une adresse</h3>
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
              name="address1"
              value={form.address1}
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
              name="postalcode"
              value={form.postalcode}
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
              id="defaultAddress"
              name="is_default"
              checked={form.is_default}
              onChange={handleChange}
            />
            <label htmlFor="defaultAddress">Définir par défaut</label>
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