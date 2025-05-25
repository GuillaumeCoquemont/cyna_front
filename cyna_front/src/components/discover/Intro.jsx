

import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/components/discover/Intro.module.css';

const Intro = () => {
  return (
    <section className={styles.introSection}>
      <div className={styles.introContent}>
        <h1 className={styles.title}>
          CYNA : <br />
          <span className={styles.subtitle}>Pure player en cybersécurité pour PME et MSP</span>
        </h1>
        <p className={styles.description}>
          Cyna protège les entreprises contre les cyberattaques
        </p>
        <div className={styles.buttonGroup}>
          <Link to="/contact" className={`${styles.button} ${styles.primaryButton}`}>
            Contact
          </Link>
          <Link to="/products" className={`${styles.button} ${styles.primaryButton}`}>
            Catalogue
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Intro;