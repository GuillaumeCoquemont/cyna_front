// src/api/promoCodes.js
import { API_BASE_URL } from './config';
const URL = `${API_BASE_URL}/api/promo-codes`;

/**
 * Récupère la liste des codes promo
 */
export async function fetchPromoCodes() {
  const res = await fetch(URL);
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}