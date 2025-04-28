import React, { useState } from 'react';
import styles from '../../styles/components/auth/AuthForm.module.css';

const AuthForm = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'register' && formData.password !== formData.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    // Ici, vous ajouterez la logique d'authentification
    console.log('Form submitted:', formData);
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'login' ? styles.active : ''}`}
          onClick={() => setActiveTab('login')}
        >
          Connexion
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'register' ? styles.active : ''}`}
          onClick={() => setActiveTab('register')}
        >
          Inscription
        </button>
      </div>

      <form className={styles.authForm} onSubmit={handleSubmit}>
        {activeTab === 'register' && (
          <div className={styles.formGroup}>
            <label htmlFor="name">Nom</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {activeTab === 'register' && (
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <button type="submit" className={styles.submitButton}>
          {activeTab === 'login' ? 'Se connecter' : "S'inscrire"}
        </button>
      </form>
    </div>
  );
};

export default AuthForm; 