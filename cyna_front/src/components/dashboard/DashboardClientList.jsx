import React, { useState, useEffect } from 'react';
import styles from '../../styles/components/dashboardClient/DashboardUsersClient.module.css';
import { fetchUsers, fetchRoles } from '../../api/users';

export default function ClientList() {
  const [clients, setClients] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    // Charge tous les utilisateurs
    fetchUsers()
      .then(data => setClients(data))
      .catch(console.error);

    // Charge la liste des rôles pour afficher le libellé (facultatif ici)
    fetchRoles()
      .then(data => setRoles(data))
      .catch(console.error);
  }, []);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Liste des clients</h3>
      <ul className={styles.userList}>
        {clients.map(client => (
          <li key={client.id} className={styles.userItem}>
            <span className={styles.userName}>{client.name}</span>
            <span className={styles.userEmail}>{client.email}</span>
            <span className={styles.userRole}>
              {roles.find(r => r.id === client.role_id)?.name || '—'}
            </span>
          </li>
        ))}
        {clients.length === 0 && <p>Aucun client trouvé.</p>}
      </ul>
    </div>
  );
}