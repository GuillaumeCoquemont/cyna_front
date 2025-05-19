import React, { useState, useEffect } from 'react';
import { fetchServices } from '../../api/services';
import styles from '../../styles/components/discover/Services.module.css';

export default function Services() {
  const [services, setServices] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchServices()
      .then(data => setServices(data))
      .catch(err => setError(err.message));
  }, []);

  if (error) return <p>Erreur chargement services : {error}</p>;

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