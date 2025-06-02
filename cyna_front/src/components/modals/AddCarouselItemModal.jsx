import React, { useState } from 'react';
import styles from '../../styles/components/modals/CarouselModal.module.css';

export default function AddCarouselItemModal({ isOpen, onClose, products, onSave }) {
  const [form, setForm] = useState({ product_id: '' });
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
    try {
      await onSave({ product_id: form.product_id });
      onClose();
      setForm({ product_id: '' });
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'ajout');
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
