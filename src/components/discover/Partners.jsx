import React from 'react';
import styles from '../../styles/components/discover/Partners.module.css';

const partners = [
  '/images/partners/logo1.png',
  '/images/partners/logo2.png',
  '/images/partners/logo3.png',
  '/images/partners/logo4.png',
  '/images/partners/logo5.png',
];

export default function Partners() {
  return (
    <section className={styles.partnersSection}>
      <div className={styles.headerGroup}>
        <h2 className={styles.title}>Une expertise reconnue par des organismes de confiances</h2>
        <p className={styles.subtitle}>
          Chez Cyna, nous nous engageons à respecter les normes les plus élevées en matière de cybersécurité. Nos certifications garantissent la qualité de nos services.
        </p>
      </div>
      <div className={styles.slider}>
        <div className={styles.slideTrack}>
          {partners.concat(partners).map((src, idx) => (
            <div key={idx} className={styles.slide}>
              <img loading="lazy" src={src} alt={`Partner ${idx + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
