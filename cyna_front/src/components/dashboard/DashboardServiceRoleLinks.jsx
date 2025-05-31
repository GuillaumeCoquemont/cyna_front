import React, { useState, useEffect } from 'react';
import {
  fetchServiceRoleLinks,
  addServiceRoleLink,
  deleteServiceRoleLink
} from '../../api/assoServicesRoles';
import { fetchServices } from '../../api/services';
import { fetchRoles } from '../../api/roles';
import styles from '../../styles/components/dashboard/ServiceRoleLinks.module.css';

export default function ServiceRoleLinks() {
  const [links, setLinks] = useState([]);
  const [services, setServices] = useState([]);
  const [roles, setRoles] = useState([]);
  const [newServiceId, setNewServiceId] = useState('');
  const [newRoleId, setNewRoleId] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load existing links
    fetchServiceRoleLinks()
      .then(data => setLinks(data))
      .catch(err => console.error('Erreur fetch links:', err));

    // Load services for select
    fetchServices()
      .then(data => setServices(data))
      .catch(err => console.error('Erreur fetch services:', err));

    // Load roles for select
    fetchRoles()
      .then(data => setRoles(data))
      .catch(err => console.error('Erreur fetch roles:', err));
  }, []);

  const handleAddLink = async e => {
    e.preventDefault();
    setError(null);
    if (!newServiceId || !newRoleId) {
      setError('Veuillez sélectionner un service et un rôle.');
      return;
    }
    try {
      await addServiceRoleLink(+newServiceId, +newRoleId);
      const updated = await fetchServiceRoleLinks();
      setLinks(updated);
      setNewServiceId('');
      setNewRoleId('');
    } catch (err) {
      console.error('Erreur ajout liaison:', err);
      setError(err.message || 'Impossible d’ajouter cette liaison.');
    }
  };

  const handleDeleteLink = async (serviceId, roleId) => {
    if (!window.confirm('Confirmez la suppression de cette liaison ?')) return;
    try {
      await deleteServiceRoleLink(serviceId, roleId);
      setLinks(prev =>
        prev.filter(l => !(l.service_id === serviceId && l.role_id === roleId))
      );
    } catch (err) {
      console.error('Erreur suppression liaison:', err);
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Services ↔ Rôles</h3>

      {/* Table of existing links */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Service</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {links.map(link => {
            const serviceLabel =
              services.find(s => s.id === link.service_id)?.Name ||
              `ID : ${link.service_id}`;
            const roleLabel =
              roles.find(r => r.id === link.role_id)?.Name ||
              `ID : ${link.role_id}`;
            return (
              <tr key={`${link.service_id}-${link.role_id}`}>
                <td>{serviceLabel} (ID : {link.service_id})</td>
                <td>{roleLabel} (ID : {link.role_id})</td>
                <td>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDeleteLink(link.service_id, link.role_id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            );
          })}
          {links.length === 0 && (
            <tr>
              <td colSpan="3">Aucune liaison trouvée.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Form to add new link */}
      <form className={styles.form} onSubmit={handleAddLink}>
        <div className={styles.field}>
          <label>Choisir Service</label>
          <select
            value={newServiceId}
            onChange={e => setNewServiceId(e.target.value)}
          >
            <option value="">-- Sélectionner --</option>
            {services.map(s => (
              <option key={s.id} value={s.id}>
                {s.Name} (ID : {s.id})
              </option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label>Choisir Rôle</label>
          <select
            value={newRoleId}
            onChange={e => setNewRoleId(e.target.value)}
          >
            <option value="">-- Sélectionner --</option>
            {roles.map(r => (
              <option key={r.id} value={r.id}>
                {r.Name} (ID : {r.id})
              </option>
            ))}
          </select>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.saveBtn}>
          Ajouter la liaison
        </button>
      </form>
    </div>
  );
}
