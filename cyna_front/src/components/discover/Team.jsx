import React, { useState, useEffect } from 'react';
import styles from '../../styles/components/discover/Team.module.css';
import { fetchTeam } from '../../api/team';

export default function Team() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeam()
      .then(setMembers)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Chargement…</p>;
  if (error)   return <p>Erreur : {error}</p>;

  return (
    <section className={styles.teamSection}>
      <div className={styles.headerGroup}>
        <h2 className={styles.title}>Découvrez notre équipe</h2>
        <p className={styles.subtitle}>Nos experts à votre service</p>
      </div>
      <div className={styles.grid}>
        {members.map(member => (
          <div key={member.id} className={styles.card}>
            <img src={member.avatar} alt={member.name} className={styles.avatar} />
            <h3 className={styles.name}>{member.name}</h3>
            <p className={styles.role}>{member.role}</p>
            <p className={styles.description}>{member.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}