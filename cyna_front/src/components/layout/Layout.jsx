import React from 'react';
import styles from '../../styles/components/auth/Layout/Layout.module.css';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className={styles.pageContainer}>
      <Header />
      <main className={styles.pageContent}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout; 