import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/components/sections/HeroSection.module.css';

const HeroSection = () => {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroContent}>
        <h1 className={styles.title}>
          CYNA : <br />
          <span className={styles.subtitle}>Protection contre les cyberattaques</span>
        </h1>
        <p className={styles.description}>Pure player en cybersécurité pour PME et MSP</p>
        <div className={styles.buttonGroup}>
          <Link to="/contact" className={`${styles.button} ${styles.primaryButton}`}>
            Contact
          </Link>
          <Link to="/decouvrir" className={`${styles.button} ${styles.primaryButton}`}>
            Découvrir
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 