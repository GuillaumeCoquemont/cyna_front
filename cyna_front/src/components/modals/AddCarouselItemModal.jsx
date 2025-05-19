import React, { useState } from 'react';
import styles from '../../styles/components/modals/CarouselModal.module.css';

export default function AddCarouselItemModal({ isOpen, onClose, products, onSave }) {
  const [form, setForm] = useState({ product_id: '', order: 1 });

  if (!isOpen) return null;

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'order' ? parseInt(value, 10) : value
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.product_id) {
      window.alert('Veuillez sélectionner un produit');
      return;
    }
    onSave(form);
    setForm({ product_id: '', order: 1 });
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
              required
            />
          </label>
          <div className={styles.actions}>
            <button type="button" onClick={onClose}>Annuler</button>
            <button type="submit">Ajouter</button>
          </div>
        </form>
      </div>
    </div>
  );
}
