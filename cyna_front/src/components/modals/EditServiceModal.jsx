import React, { useState, useEffect } from 'react';
import styles from '../../styles/components/modals/ServiceModal.module.css';

export default function EditServiceModal({ isOpen, onClose, onSave, service }) {
  const [form, setForm] = useState({
    key: '',
    title: '',
    subtitle: '',
    description: '',
    image: ''
  });

  useEffect(() => {
    if (service) {
      setForm({
        key: service.key,
        title: service.title,
        subtitle: service.subtitle,
        description: service.description,
        image: service.image || ''
      });
    }
  }, [service]);

  if (!isOpen) return null;

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <h3>Modifier le service</h3>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            Clé (identifiant)
            <input name="key" value={form.key} disabled />
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
            <button type="submit">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  );
}