import Team from '../components/discover/Team';
import React from 'react';
import styles from '../styles/pages/Discover.module.css';
import Services from '../components/discover/Services';
import Partners from '../components/discover/Partners';

export default function Discover() {
  return (
      <main className={styles.container}>
        <Team />
        <Services />
        <Partners />
      </main>
  );
}
