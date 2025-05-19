import React, { useState } from 'react';
import styles from '../../styles/components/modals/ServiceModal.module.css';

export default function AddServiceModal({ isOpen, onClose, onSave, existingKeys }) {
  const [form, setForm] = useState({
    key: '',
    title: '',
    subtitle: '',
    description: '',
    image: ''
  });

  if (!isOpen) return null;

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.key || existingKeys.includes(form.key)) {
      window.alert('Clé invalide ou déjà utilisée');
      return;
    }
    onSave(form);
    setForm({ key: '', title: '', subtitle: '', description: '', image: '' });
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <h3>Ajouter un service</h3>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            Clé (identifiant)
            <input name="key" value={form.key} onChange={handleChange} required />
          </label>
          <label>
            Titre
            <input name="title" value={form.title} onChange={handleChange} required />
          </label>
          <label>
            Sous-titre
            <input name="subtitle" value={form.subtitle} onChange={handleChange} required />
          </label>
          <label>
            Description
            <textarea name="description" value={form.description} onChange={handleChange} required />
          </label>
          <label>
            URL Image
            <input name="image" value={form.image} onChange={handleChange} />
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