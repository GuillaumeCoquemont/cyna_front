// src/api/assoCategoryProductsRoles.js
import { API_BASE_URL } from './config';
const URL = `${API_BASE_URL}/asso-categoryproducts-roles`;

/**
 * Récupère toutes les associations category_id ↔ role_id
 */
export async function fetchCategoryProductRoleLinks() {
  const token = localStorage.getItem('token');
  const res = await fetch(URL, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

/**
 * Crée une association { category_id, role_id }
 */
export async function addCategoryProductRoleLink(categoryId, roleId) {
  const token = localStorage.getItem('token');
  const res = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify({ category_id: categoryId, role_id: roleId })
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

/**
 * Supprime l’association identifiée par (categoryId, roleId)
 */
export async function deleteCategoryProductRoleLink(categoryId, roleId) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${URL}/${categoryId}/${roleId}`, {
    method: 'DELETE',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return;
}