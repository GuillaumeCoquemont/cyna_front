import React, { useState, useEffect } from 'react';
import styles from '../../styles/components/modals/TeamModal.module.css';

export default function EditTeamMemberModal({ isOpen, onClose, member, onSave }) {
  const [form, setForm] = useState({ name: '', role: '', avatar: '', description: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (member) {
      setForm({
        name: member.name,
        role: member.role,
        avatar: member.avatar,
        description: member.description
      });
    }
  }, [member]);

  if (!isOpen) return null;

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name || !form.role) {
      setError('Le nom et le rôle sont requis');
      return;
    }
    setError('');
    const newId = Date.now();
    onSave({ id: newId, ...form });
    setForm({ name: '', role: '', avatar: '', description: '' });
    onClose();
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <h3>Modifier un membre</h3>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label>Nom*</label>
            <input name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className={styles.field}>
            <label>Rôle*</label>
            <input name="role" value={form.role} onChange={handleChange} required />
          </div>
          <div className={styles.field}>
            <label>Avatar (URL)</label>
            <input name="avatar" value={form.avatar} onChange={handleChange} />
          </div>
          <div className={styles.field}>
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} />
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
