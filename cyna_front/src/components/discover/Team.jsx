import React from 'react';
import styles from '../../styles/components/discover/Team.module.css';

const teamMembers = [
  { name: 'Alice Dupont', role: 'CEO', avatar: '/avatars/alice.jpg',
    description: 'Alice dirige la vision stratégique de Cyna et assure la coordination des activités.' },
  { name: 'Bob Martin', role: 'CTO', avatar: '/avatars/bob.jpg',
    description: 'Bob supervise le développement technologique et l\'innovation chez Cyna.' },
  { name: 'Claire Durand', role: 'CISO', avatar: '/avatars/claire.jpg',
    description: 'Claire garantit la sécurité des informations et la conformité aux normes.' },
];

export default function Team() {
  return (
    <section className={styles.teamSection}>
      <div className={styles.headerGroup}>
        <h2 className={styles.title}>Découvrez notre équipe</h2>
        <p className={styles.subtitle}>Nos experts à votre service</p>
      </div>
      <div className={styles.grid}>
        {teamMembers.map((member) => (
          <div key={member.name} className={styles.card}>
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
