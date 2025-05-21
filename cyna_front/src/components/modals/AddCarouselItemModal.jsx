import React, { useState } from 'react';
import styles from '../../styles/components/modals/CarouselModal.module.css';

export default function AddCarouselItemModal({ isOpen, onClose, products, onSave }) {
  const [form, setForm] = useState({ product_id: '', order: '1' });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.product_id) {
      setError('Veuillez sélectionner un produit');
      return;
    }
    const payload = {
      product_id: parseInt(form.product_id, 10),
      order: parseInt(form.order, 10) || 1
    };
    try {
      await onSave(payload);
      onClose();
      setForm({ product_id: '', order: '1' });
    } catch (err) {
      // Show server error message or custom text
      setError(err.message || 'Ordre déjà utilisé');
    }
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <h3>Ajouter un produit au carrousel</h3>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            Produit
            <select name="product_id" value={form.product_id} onChange={handleChange} required>
              <option value="">-- Choisir --</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
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
