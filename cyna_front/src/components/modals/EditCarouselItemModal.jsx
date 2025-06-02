import React, { useState, useEffect } from 'react';
import styles from '../../styles/components/modals/CarouselModal.module.css';

export default function EditCarouselItemModal({ isOpen, onClose, item, onSave }) {
  const [form, setForm] = useState({ id: null, order: 1 });

  useEffect(() => {
    if (item) {
      setForm({
        id: item.id,
        order: item.order
      });
    }
  }, [item]);

  if (!isOpen) return null;

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'order' ? parseInt(value, 10) : prev[name]
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <h3>Modifier un élément du carrousel</h3>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            Produit
            <input
              type="text"
              disabled
              className={styles.input}
            />
          </label>
          <label>
            Ordre d'affichage
            <input
              type="number"
              name="order"
              value={form.order}
              onChange={handleChange}
              min="1"
              className={styles.input}
              required
            />
          </label>
          <div className={styles.actions}>
            <button type="button" onClick={onClose}>Annuler</button>
            <button type="submit">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
);
}
