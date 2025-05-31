import React, { useState, useEffect } from 'react';
import {
  fetchRolePromoCodeLinks,
  addRolePromoCodeLink,
  deleteRolePromoCodeLink
} from '../../api/assoRolesPromoCodes';
import { fetchRoles } from '../../api/roles';
import { fetchPromoCodes } from '../../api/promoCodes';
import styles from '../../styles/components/dashboard/RolePromoCodeLinks.module.css';

export default function RolePromoCodeLinks() {
  const [links, setLinks] = useState([]);
  const [roles, setRoles] = useState([]);
  const [promoCodes, setPromoCodes] = useState([]);
  const [newRoleId, setNewRoleId] = useState('');
  const [newPromoCodeId, setNewPromoCodeId] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load existing links
    fetchRolePromoCodeLinks()
      .then(data => setLinks(data))
      .catch(err => console.error('Erreur fetch links:', err));

    // Load roles for select
    fetchRoles()
      .then(data => setRoles(data))
      .catch(err => console.error('Erreur fetch roles:', err));

    // Load promo codes for select
    fetchPromoCodes()
      .then(data => setPromoCodes(data))
      .catch(err => console.error('Erreur fetch promo codes:', err));
  }, []);

  const handleAddLink = async e => {
    e.preventDefault();
    setError(null);
    if (!newRoleId || !newPromoCodeId) {
      setError('Veuillez sélectionner un rôle et un code promo.');
      return;
    }
    try {
      await addRolePromoCodeLink(+newRoleId, +newPromoCodeId);
      const updated = await fetchRolePromoCodeLinks();
      setLinks(updated);
      setNewRoleId('');
      setNewPromoCodeId('');
    } catch (err) {
      console.error('Erreur ajout liaison:', err);
      setError(err.message || 'Impossible d’ajouter cette liaison.');
    }
  };

  const handleDeleteLink = async (roleId, promoCodeId) => {
    if (!window.confirm('Confirmez la suppression de cette liaison ?')) return;
    try {
      await deleteRolePromoCodeLink(roleId, promoCodeId);
      setLinks(prev =>
        prev.filter(l => !(l.role_id === roleId && l.promo_code_id === promoCodeId))
      );
    } catch (err) {
      console.error('Erreur suppression liaison:', err);
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Rôles ↔ Codes Promo</h3>

      {/* Table of existing links */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Rôle</th>
            <th>Code Promo</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {links.map(link => {
            const roleLabel =
              roles.find(r => r.id === link.role_id)?.Name ||
              `ID : ${link.role_id}`;
            const promoLabel =
              promoCodes.find(p => p.id === link.promo_code_id)?.Name ||
              `ID : ${link.promo_code_id}`;
            return (
              <tr key={`${link.role_id}-${link.promo_code_id}`}>
                <td>{roleLabel} (ID : {link.role_id})</td>
                <td>{promoLabel} (ID : {link.promo_code_id})</td>
                <td>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDeleteLink(link.role_id, link.promo_code_id)}
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
          <label>Choisir Rôle</label>
          <select
            value={newRoleId}
            onChange={e => setNewRoleId(e.target.value)}
          >
            <option value="">-- Sélectionner --</option>
            {roles.map(r => (
              <option key={r.id} value={r.id}>
                {r.Name} (ID : {r.id})
              </option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label>Choisir Code Promo</label>
          <select
            value={newPromoCodeId}
            onChange={e => setNewPromoCodeId(e.target.value)}
          >
            <option value="">-- Sélectionner --</option>
            {promoCodes.map(p => (
              <option key={p.id} value={p.id}>
                {p.Name} (ID : {p.id})
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
