import React, { useState, useEffect } from 'react';
import styles from '../../styles/components/modals/EditTeamModal.module.css';

export default function EditTeamModal({ isOpen, onClose, member, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    avatar: '',
    description: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || '',
        role: member.role || '',
        avatar: member.avatar || '',
        description: member.description || ''
      });
    }
  }, [member]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.role.trim()) {
      setError('Le nom et le rôle sont requis.');
      return;
    }
    setError('');
    onSave({ id: member.id, ...formData });
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <h3>Modifier un membre</h3>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label>Nom *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.field}>
            <label>Rôle *</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.field}>
            <label>Avatar (URL)</label>
            <input
              type="text"
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
            />
          </div>
          <div className={styles.field}>
            <label>Description</label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.actions}>
            <button type="button" onClick={onClose}>Annuler</button>
            <button type="submit">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
);
}
