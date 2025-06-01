// src/api/promoCodes.js
import { API_BASE_URL } from './config';
const URL = `${API_BASE_URL}/api/promo-codes`;

/**
 * Récupère la liste des codes promo
 */
export async function fetchPromoCodes() {
  const token = localStorage.getItem('token');
  const res = await fetch(URL, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}