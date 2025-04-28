import React from 'react';
import AuthForm from '../components/auth/AuthForm';
import styles from '../styles/pages/AuthPage.module.css';

const AuthPage = () => {
  return (
    <div className={styles.authPage}>
      <AuthForm />
    </div>
  );
};

export default AuthPage; 