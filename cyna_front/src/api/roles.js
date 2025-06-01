// src/api/roles.js
import { API_BASE_URL } from './config';
const URL = `${API_BASE_URL}/api/roles`;

/**
 * Récupère la liste des rôles (superadmin, admin, user, etc.)
 */
export async function fetchRoles() {
  const token = localStorage.getItem('token');
  const res = await fetch(URL, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}