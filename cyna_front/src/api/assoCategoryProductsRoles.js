// src/api/assoCategoryProductsRoles.js
import { API_BASE_URL } from './config';
const URL = `${API_BASE_URL}/api/asso-categoryproducts-roles`;

/**
 * Récupère toutes les associations category_id ↔ role_id
 */
export async function fetchCategoryProductRoleLinks() {
  const res = await fetch(URL);
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

/**
 * Crée une association { category_id, role_id }
 */
export async function addCategoryProductRoleLink(categoryId, roleId) {
  const res = await fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category_id: categoryId, role_id: roleId })
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

/**
 * Supprime l’association identifiée par (categoryId, roleId)
 */
export async function deleteCategoryProductRoleLink(categoryId, roleId) {
  const res = await fetch(`${URL}/${categoryId}/${roleId}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return;
}