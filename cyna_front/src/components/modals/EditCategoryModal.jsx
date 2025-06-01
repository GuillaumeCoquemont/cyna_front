import React, { useState, useEffect } from 'react';
import styles from '../../styles/components/modals/CategoryModal.module.css';

export default function EditCategoryModal({ isOpen, onClose, category, onSave }) {
  const [form, setForm] = useState({ id: '', name: '', description: '' });
  const [error, setError] = useState('');

  // Pré-remplissage et reset à chaque ouverture
  useEffect(() => {
    if (isOpen && category) {
      setForm({
        id: category.id,
        name: category.name,
        description: category.description
      });
      setError('');
    }
  }, [isOpen, category]);

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
      setError(err.message || 'Erreur lors de la modification de la catégorie.');
    }
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <h3>Modifier une catégorie</h3>
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