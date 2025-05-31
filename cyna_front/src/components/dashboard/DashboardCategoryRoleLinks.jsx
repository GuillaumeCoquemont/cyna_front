import React, { useState, useEffect } from 'react';
import {
  fetchCategoryProductRoleLinks,
  addCategoryProductRoleLink,
  deleteCategoryProductRoleLink
} from '../../api/assoCategoryProductsRoles';
import { fetchCategories } from '../../api/categories';
import { fetchRoles } from '../../api/roles';
import styles from '../../styles/components/dashboard/CategoryRoleLinks.module.css';

export default function CategoryRoleLinks() {
  const [links, setLinks] = useState([]);           // Liste des associations existantes
  const [categories, setCategories] = useState([]); // Pour remplir le <select> catégories
  const [roles, setRoles] = useState([]);           // Pour remplir le <select> rôles

  // États pour le nouveau lien à créer
  const [newCategoryId, setNewCategoryId] = useState('');
  const [newRoleId, setNewRoleId] = useState('');
  const [error, setError] = useState(null);

  // Charger les données lorsqu’on monte le composant
  useEffect(() => {
    // 1) Les associations existantes
    fetchCategoryProductRoleLinks()
      .then(data => setLinks(data))
      .catch(err => console.error('Erreur fetch links:', err));

    // 2) Les catégories (pour <select>)
    fetchCategories()
      .then(data => setCategories(data))
      .catch(err => console.error('Erreur fetch categories:', err));

    // 3) Les rôles (pour <select>)
    fetchRoles()
      .then(data => setRoles(data))
      .catch(err => console.error('Erreur fetch roles:', err));
  }, []);

  // Fonction pour ajouter un lien
  const handleAddLink = async (e) => {
    e.preventDefault();
    setError(null);
    if (!newCategoryId || !newRoleId) {
      setError('Vous devez choisir une catégorie et un rôle.');
      return;
    }
    try {
      await addCategoryProductRoleLink(+newCategoryId, +newRoleId);
      // Raffraîchir la liste des liens
      const updated = await fetchCategoryProductRoleLinks();
      setLinks(updated);
      // Réinitialiser les champs
      setNewCategoryId('');
      setNewRoleId('');
    } catch (err) {
      console.error('Erreur adding link:', err);
      setError(err.message || 'Erreur lors de l’ajout de l’association');
    }
  };

  // Fonction pour supprimer un lien
  const handleDeleteLink = async (categoryId, roleId) => {
    if (!window.confirm('Supprimer cette association ?')) return;
    try {
      await deleteCategoryProductRoleLink(categoryId, roleId);
      // Raffraîchir la liste
      setLinks(prev => prev.filter(
        l => !(l.category_id === categoryId && l.role_id === roleId)
      ));
    } catch (err) {
      console.error('Erreur delete link:', err);
      // Optionnel : afficher une alerte ou un message d’erreur
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Catégories ↔ Rôles</h3>

      {/* 1) Tableau des associations existantes */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Catégorie</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {links.map(link => {
            // Pour afficher le “Name” de la catégorie et du rôle, on recherche dans les tableaux précédemment chargés
            const categoryName = categories.find(c => c.id === link.category_id)?.Name || '—';
            const roleName     = roles.find(r => r.id === link.role_id)?.Name || '—';
            return (
              <tr key={`${link.category_id}-${link.role_id}`}>
                <td>{categoryName} (ID : {link.category_id})</td>
                <td>{roleName} (ID : {link.role_id})</td>
                <td>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDeleteLink(link.category_id, link.role_id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            );
          })}
          {links.length === 0 && (
            <tr>
              <td colSpan="3">Aucune association trouvée.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 2) Formulaire d’ajout d’une nouvelle association */}
      <form className={styles.form} onSubmit={handleAddLink}>
        <div className={styles.field}>
          <label>Catégorie</label>
          <select
            value={newCategoryId}
            onChange={e => setNewCategoryId(e.target.value)}
          >
            <option value="">-- Choisir la catégorie --</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.Name} (ID : {c.id})
              </option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label>Rôle</label>
          <select
            value={newRoleId}
            onChange={e => setNewRoleId(e.target.value)}
          >
            <option value="">-- Choisir le rôle --</option>
            {roles.map(r => (
              <option key={r.id} value={r.id}>
                {r.Name} (ID : {r.id})
              </option>
            ))}
          </select>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.saveBtn}>
          Ajouter l’association
        </button>
      </form>
    </div>
  );
}