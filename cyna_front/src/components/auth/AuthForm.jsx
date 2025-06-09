import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/components/auth/AuthForm.module.css';
import { AuthContext } from '../../context/AuthContext';
import { login as apiLogin, register as apiRegister } from '../../api/auth';
import { jwtDecode } from "jwt-decode";

const AuthForm = () => {
  const { signIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError('');
    const newErrors = {};
    if (!formData.email) newErrors.email = "L'email est requis";
    if (!formData.password) newErrors.password = "Le mot de passe est requis";

    if (activeTab === 'register') {
      if (!formData.name) newErrors.name = "Le nom est requis";
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (activeTab === 'register') {
        await apiRegister({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
      }
      const me = await signIn({ email: formData.email, password: formData.password });
      const decoded = jwtDecode(me.token); 
      if (decoded.role === 'admin') navigate('/dashboard');
      else navigate('/dashboardClient');
    } catch (err) {
      console.error("Erreur d'authentification :", err);
      const errorMessage = err?.message || "Échec de l'authentification";
      setGlobalError(errorMessage);
    }
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
            {errors.name && <p className={styles.error}>{errors.name}</p>}
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
          {errors.email && <p className={styles.error}>{errors.email}</p>}
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
          {errors.password && <p className={styles.error}>{errors.password}</p>}
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
            {errors.confirmPassword && <p className={styles.error}>{errors.confirmPassword}</p>}
          </div>
        )}
        <button type="submit" className={styles.submitButton}>
          {activeTab === 'login' ? 'Se connecter' : "S'inscrire"}
        </button>
      </form>
      {globalError && <div className={styles.globalError}>{globalError}</div>}
    </div>
  );
};

export default AuthForm;