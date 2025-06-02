import React, { useState } from 'react';
import styles from '../../styles/components/dashboard/DashboardCodePromo.module.css';
import { addPromoCode } from '../../api/promoCodes';

const AddPromoCodeModal = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderAmount: '',
    maxDiscountAmount: '',
    startDate: '',
    endDate: '',
    maxUses: '',
    isActive: true
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validation des dates
      if (form.startDate && form.endDate && new Date(form.startDate) >= new Date(form.endDate)) {
        alert('La date de début doit être antérieure à la date de fin');
        return;
      }

      // Validation du pourcentage
      if (form.discountType === 'percentage' && (form.discountValue < 0 || form.discountValue > 100)) {
        alert('Le pourcentage de réduction doit être entre 0 et 100');
        return;
      }

      // Validation des montants
      if (form.minOrderAmount && parseFloat(form.minOrderAmount) < 0) {
        alert('Le montant minimum de commande doit être positif');
        return;
      }

      if (form.maxDiscountAmount && parseFloat(form.maxDiscountAmount) < 0) {
        alert('Le montant maximum de remise doit être positif');
        return;
      }

      // Validation du nombre d'utilisations
      if (form.maxUses && parseInt(form.maxUses) < 0) {
        alert('Le nombre maximum d\'utilisations doit être positif');
        return;
      }

      // Conversion et formatage des données
      const dataToSend = {
        code: form.code.trim(),
        description: form.description.trim(),
        discountType: form.discountType,
        discountValue: parseFloat(form.discountValue),
        minOrderAmount: form.minOrderAmount ? parseFloat(form.minOrderAmount) : null,
        maxDiscountAmount: form.maxDiscountAmount ? parseFloat(form.maxDiscountAmount) : null,
        startDate: form.startDate ? new Date(form.startDate).toISOString() : null,
        endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
        maxUses: form.maxUses ? parseInt(form.maxUses) : null,
        isActive: form.isActive
      };

      await addPromoCode(dataToSend);
      onSuccess();
      onClose();
      setForm({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: '',
        minOrderAmount: '',
        maxDiscountAmount: '',
        startDate: '',
        endDate: '',
        maxUses: '',
        isActive: true
      });
    } catch (err) {
      console.error('Erreur saving promo code:', err);
      alert(err.message || 'Une erreur est survenue lors de la création du code promo');
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <h3>Ajouter un code promo</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Code</label>
            <input
              type="text"
              name="code"
              value={form.code}
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
            <label>Type de remise</label>
            <select
              name="discountType"
              value={form.discountType}
              onChange={handleChange}
              required
            >
              <option value="percentage">Pourcentage (%)</option>
              <option value="fixed">Montant fixe (€)</option>
            </select>
          </div>
          <div className={styles.field}>
            <label>Valeur de la remise</label>
            <input
              type="number"
              name="discountValue"
              value={form.discountValue}
              onChange={handleChange}
              required
              min="0"
              max={form.discountType === 'percentage' ? '100' : undefined}
              step={form.discountType === 'percentage' ? '1' : '0.01'}
            />
          </div>
          <div className={styles.field}>
            <label>Montant minimum de commande (€)</label>
            <input
              type="number"
              name="minOrderAmount"
              value={form.minOrderAmount}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
          </div>
          <div className={styles.field}>
            <label>Remise maximum (€)</label>
            <input
              type="number"
              name="maxDiscountAmount"
              value={form.maxDiscountAmount}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
          </div>
          <div className={styles.field}>
            <label>Date de début</label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className={styles.field}>
            <label>Date de fin</label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              min={form.startDate || new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          <div className={styles.field}>
            <label>Nombre maximum d'utilisations</label>
            <input
              type="number"
              name="maxUses"
              value={form.maxUses}
              onChange={handleChange}
              min="0"
            />
          </div>
          <div className={styles.field}>
            <label>
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={(e) => handleChange({ target: { name: 'isActive', value: e.target.checked } })}
              />
              Actif
            </label>
          </div>
          <div className={styles.actions}>
            <button type="submit">Enregistrer</button>
            <button type="button" onClick={onClose}>Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPromoCodeModal; 