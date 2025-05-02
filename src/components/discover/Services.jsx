import React from 'react';
import styles from '../../styles/components/discover/Services.module.css';

const services = [
  {
    key: 'prevention',
    title: 'Prévention',
    subtitle: 'Audit de sécurité',
    description: 'Réduisez votre niveau d’exposition aux risques grâce à nos audits.',
    image: '/images/prevention.jpg',
  },
  {
    key: 'protection',
    title: 'Protection',
    subtitle: 'SOC 24/7',
    description: 'Défendez-vous face aux menaces grâce à une surveillance en temps réel 24/7.',
    image: '/images/protection.jpg',
  },
  {
    key: 'reponse',
    title: 'Réponse',
    subtitle: 'Cyna CERT',
    description: 'Soyez sécurisé avec notre CERT qui répond présent en cas d’attaque : investigation, éradication et remédiation.',
    image: '/images/reponse.jpg',
  },
];

export default function Services() {
  return (
    <section className={styles.servicesSection}>
      <div className={styles.headerGroup}>
        <h2 className={styles.title}>Découvrez nos services</h2>
        <p className={styles.subtitle}>
          Cyna s’adapte à vos besoins et vous propose un accompagnement dans la protection globale de votre SI.
        </p>
      </div>
      {services.map((svc) => (
        <div key={svc.key} className={styles.serviceRow}>
          <div className={styles.serviceHeader}>{svc.title}</div>
          <div className={styles.serviceContent}>
            <div className={styles.textBlock}>
              <h4 className={styles.subtitleItem}>{svc.subtitle}</h4>
              <p>{svc.description}</p>
            </div>
            <div className={styles.imageBlock}>
              <img src={svc.image} alt={svc.title} />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}