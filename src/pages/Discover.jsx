import Team from '../components/discover/Team';
import React from 'react';
import styles from '../styles/pages/Discover.module.css';
import Services from '../components/discover/Services';
import Partners from '../components/discover/Partners';
import Intro from '../components/discover/Intro';

export default function Discover() {
  return (
      <main className={styles.container}>
      <Intro />
        <Team />
        <Services />
        <Partners />
      </main>
  );
}
