import React, { useState, useEffect } from 'react';
import styles from '../../styles/components/dashboardClient/DashboardProfile.module.css';

const mockUser = {
  firstName: 'Guillaume',
  lastName: 'Coquemont',
  email: 'guillaume@example.com',
  phone: '+33 6 12 34 56 78'
};

export default function DashboardProfile() {
  const [user, setUser] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Simuler fetch des données utilisateur
    setUser(mockUser);
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
    try {
      // TODO: appel API pour sauvegarder profile
      console.log('Profil sauvegardé', user);
      if (passwords.new && passwords.new === passwords.confirm) {
        console.log('Mot de passe mis à jour');
        // TODO: API pour mise à jour mot de passe
      }
      // Reset passwords fields
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (err) {
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
              name="firstName"
              value={user.firstName}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Nom
            <input
              type="text"
              name="lastName"
              value={user.lastName}
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
        <button type="submit" className={styles.saveBtn} disabled={isSaving}>
          {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </form>
    </div>
  );
}
