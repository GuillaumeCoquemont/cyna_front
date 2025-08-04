import React, { useState, useEffect } from 'react';
import { updatePaymentMethod } from '../../api/paymentMethods';
import styles from '../../styles/components/modals/PaymentModal.module.css';

export default function EditPaymentMethodModal({ isOpen, onClose, method, onSave }) {
  const [form, setForm] = useState({
    id: method?.id || '',
    type: method?.type || '',
    last4: method?.last4 || '',
    expiry: method?.expiry || '',
    isDefault: method?.isDefault || false,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (method) {
      setForm({
        id: method.id,
        type: method.type,
        last4: method.last4,
        expiry: method.expiry,
        isDefault: method.isDefault,
      });
    }
  }, [method]);

  if (!isOpen) return null;

  const handleChange = e => {
    const { name, value, type: inputType, checked } = e.target;
    console.log(`handleChange: ${name} =`, inputType === 'checkbox' ? checked : value);
    setForm(prev => ({
      ...prev,
      [name]: inputType === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async e => {
    console.log('handleSubmit calling updatePaymentMethod with:', form);
    e.preventDefault();
    if (!form.type.trim() || !form.last4.trim() || !form.expiry.trim()) {
      setError('Type, 4 derniers chiffres et date d’expiration sont requis');
      return;
    }
    setError('');
    try {
      const saved = await updatePaymentMethod(form.id, form);
      console.log('API updatePaymentMethod returned:', saved);
      onSave(saved);
      onClose();
    } catch (err) {
      console.error('API error updating payment method:', err);
      setError('Impossible de modifier le moyen de paiement.');
    }
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <h3>Modifier un moyen de paiement</h3>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label>Type *</label>
            <input
              type="text"
              name="type"
              value={form.type}
              onChange={handleChange}
              placeholder="Ex: Visa"
              required
            />
          </div>
          <div className={styles.field}>
            <label>4 derniers chiffres *</label>
            <input
              type="text"
              name="last4"
              value={form.last4}
              onChange={handleChange}
              maxLength="4"
              placeholder="4242"
              required
            />
          </div>
          <div className={styles.field}>
            <label>Date d’expiration (MM/AA) *</label>
            <input
              type="text"
              name="expiry"
              value={form.expiry}
              onChange={handleChange}
              placeholder="12/24"
              required
            />
          </div>
          <div className={styles.fieldCheckbox}>
            <label>
              <input
                type="checkbox"
                name="isDefault"
                checked={form.isDefault}
                onChange={handleChange}
              />
              Définir par défaut
            </label>
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
