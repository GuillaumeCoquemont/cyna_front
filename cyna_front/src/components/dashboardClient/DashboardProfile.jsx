import React, { useState, useEffect } from 'react';
import styles from '../../styles/components/dashboardClient/DashboardProfile.module.css';
import { fetchUserProfile, updateUserProfile, updatePassword } from '../../api/userProfiles';

export default function DashboardProfile() {
  const [user, setUser] = useState({ firstname: '', lastname: '', email: '', phone: '' });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUserProfile()
      .then(data => {
        setUser({
          firstname: data.firstname || '',
          lastname: data.lastname || '',
          email: data.email || '',
          phone: data.phone || ''
        });
      })
      .catch(err => {
        setError("Impossible de charger le profil utilisateur.");
        console.error(err);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      // Mise à jour du profil
      await updateUserProfile(user);
      setSuccess('Profil mis à jour avec succès.');

      // Mise à jour du mot de passe si nécessaire
      if (passwords.new && passwords.new === passwords.confirm) {
        await updatePassword(passwords.current, passwords.new);
        setSuccess('Profil et mot de passe mis à jour avec succès.');
        setPasswords({ current: '', new: '', confirm: '' });
      }
    } catch (err) {
      setError(err.message || "Erreur lors de la sauvegarde du profil.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.profileContainer}>
      <h3 className={styles.sectionTitle}>Mon profil</h3>
      <form className={styles.profileForm} onSubmit={handleSave}>
        <div className={styles.fieldGroup}>
          <label>
            Prénom
            <input
              type="text"
              name="firstname"
              value={user.firstname}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Nom
            <input
              type="text"
              name="lastname"
              value={user.lastname}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <label>
          Email
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Téléphone
          <input
            type="tel"
            name="phone"
            value={user.phone}
            onChange={handleChange}
          />
        </label>
        <fieldset className={styles.passwordGroup}>
          <legend>Changer de mot de passe</legend>
          <label>
            Mot de passe actuel
            <input
              type="password"
              name="current"
              value={passwords.current}
              onChange={handlePasswordChange}
            />
          </label>
          <label>
            Nouveau mot de passe
            <input
              type="password"
              name="new"
              value={passwords.new}
              onChange={handlePasswordChange}
            />
          </label>
          <label>
            Confirmer mot de passe
            <input
              type="password"
              name="confirm"
              value={passwords.confirm}
              onChange={handlePasswordChange}
            />
          </label>
        </fieldset>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}
        <button type="submit" className={styles.saveBtn} disabled={isSaving}>
          {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </form>
    </div>
  );
}
