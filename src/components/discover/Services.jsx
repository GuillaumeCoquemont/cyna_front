import React from 'react';
import { FaSearch, FaShieldAlt, FaBolt } from 'react-icons/fa';
import styles from '../../styles/components/discover/Services.module.css';

export default function Services() {
  const sections = [
    {
      title: 'Prévention',
      subtitle: 'Anticipez les risques',
      description: 'Anticipez les risques de sécurité grâce à nos audits et analyses approfondies...',
      image: '/images/prevention.jpg',
      icon: <FaSearch className={styles.icon} />,
    },
    {
      title: 'Protection',
      subtitle: 'Sécurisez vos données',
      description: 'Protégez vos données et infrastructures avec des solutions pare-feu et antivirus de pointe...',
      image: '/images/protection.jpg',
      icon: <FaShieldAlt className={styles.icon} />,
    },
    {
      title: 'Réponse',
      subtitle: 'Réagissez efficacement',
      description: "Réagissez efficacement aux incidents avec notre équipe CERT dédiée à l'investigation et la remédiation...",
      image: '/images/reponse.jpg',
      icon: <FaBolt className={styles.icon} />,
    },
  ];

  return (
    <section className={styles.servicesSection}>
  <div className={styles.headerGroup}>
    <h2 className={styles.title}>Découvrez nos services</h2>
    <p className={styles.subtitle}>Cyna s’adapte à vos besoins…</p>
  </div>
  <div className={styles.cards}>
    {sections.map(sec => (
      <div key={sec.title} className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardIcon}>{sec.icon}</span>
          <h3>{sec.title}</h3>
        </div>
        <div className={styles.cardContent}>
          <h4 className={styles.subtitleItem}>{sec.subtitle}</h4>
          <p>{sec.description}</p>
        </div>
        <div className={styles.cardImage}>
          <img loading="lazy" src={sec.image} alt={sec.title} />
        </div>
        <div className={styles.cardFooter}>
          <a href="#">En savoir plus →</a>
        </div>
      </div>
    ))}
  </div>
</section>
  );
}