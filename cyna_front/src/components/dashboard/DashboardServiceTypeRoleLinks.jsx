

import React, { useState, useEffect } from 'react';
import {
  fetchServiceTypeRoleLinks,
  addServiceTypeRoleLink,
  deleteServiceTypeRoleLink
} from '../../api/assoServiceTypesRoles';
import { fetchServiceTypes } from '../../api/serviceTypes';
import { fetchRoles } from '../../api/roles';
import styles from '../../styles/components/dashboard/DashboardServiceTypeRoleLinks.module.css';

export default function DashboardServiceTypeRoleLinks() {
  const [links, setLinks] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [roles, setRoles] = useState([]);
  const [newServiceTypeId, setNewServiceTypeId] = useState('');
  const [newRoleId, setNewRoleId] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1) Load existing links
    fetchServiceTypeRoleLinks()
      .then(data => setLinks(data))
      .catch(err => console.error('Erreur fetch links:', err));

    // 2) Load service types for select
    fetchServiceTypes()
      .then(data => setServiceTypes(data))
      .catch(err => console.error('Erreur fetch service types:', err));

    // 3) Load roles for select
    fetchRoles()
      .then(data => setRoles(data))
      .catch(err => console.error('Erreur fetch roles:', err));
  }, []);

  const handleAddLink = async e => {
    e.preventDefault();
    setError(null);
    if (!newServiceTypeId || !newRoleId) {
      setError('Veuillez sélectionner un type de service et un rôle.');
      return;
    }
    try {
      await addServiceTypeRoleLink(+newServiceTypeId, +newRoleId);
      const updated = await fetchServiceTypeRoleLinks();
      setLinks(updated);
      setNewServiceTypeId('');
      setNewRoleId('');
    } catch (err) {
      console.error('Erreur ajout liaison:', err);
      setError(err.message || 'Impossible d’ajouter cette liaison.');
    }
  };

  const handleDeleteLink = async (serviceTypeId, roleId) => {
    if (!window.confirm('Confirmez la suppression de cette liaison ?')) return;
    try {
      await deleteServiceTypeRoleLink(serviceTypeId, roleId);
      setLinks(prev =>
        prev.filter(l => !(l.service_type_id === serviceTypeId && l.role_id === roleId))
      );
    } catch (err) {
      console.error('Erreur suppression liaison:', err);
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Types de service ↔ Rôles</h3>

      {/* Table of existing links */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Type de Service</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {links.map(link => {
            const serviceTypeLabel =
              serviceTypes.find(st => st.id === link.service_type_id)?.Name ||
              `ID : ${link.service_type_id}`;
            const roleLabel =
              roles.find(r => r.id === link.role_id)?.Name ||
              `ID : ${link.role_id}`;
            return (
              <tr key={`${link.service_type_id}-${link.role_id}`}>
                <td>{serviceTypeLabel} (ID : {link.service_type_id})</td>
                <td>{roleLabel} (ID : {link.role_id})</td>
                <td>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDeleteLink(link.service_type_id, link.role_id)}
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
          <label>Choisir Type de Service</label>
          <select
            value={newServiceTypeId}
            onChange={e => setNewServiceTypeId(e.target.value)}
          >
            <option value="">-- Sélectionner --</option>
            {serviceTypes.map(st => (
              <option key={st.id} value={st.id}>
                {st.Name} (ID : {st.id})
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