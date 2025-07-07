// src/api/assoRolesPromoCodes.js
import { API_BASE_URL } from './config';
const URL = `${API_BASE_URL}/asso-roles-promocodes`;

/**
 * Récupère toutes les associations role_id ↔ promo_code_id
 */
export async function fetchRolePromoCodeLinks() {
  const token = localStorage.getItem('token');
  const res = await fetch(URL, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

/**
 * Crée une association { role_id, promo_code_id }
 */
export async function addRolePromoCodeLink(roleId, promoCodeId) {
  const token = localStorage.getItem('token');
  const res = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify({ role_id: roleId, promo_code_id: promoCodeId })
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

/**
 * Supprime l’association identifiée par (roleId, promoCodeId)
 */
export async function deleteRolePromoCodeLink(roleId, promoCodeId) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${URL}/${roleId}/${promoCodeId}`, {
    method: 'DELETE',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return;
}