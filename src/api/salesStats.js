// src/api/salesStats.js
import { API_BASE_URL } from './config';

const BASE_URL = `${API_BASE_URL}/stats`;
/**
 * Récupère les statistiques mensuelles (revenu produits vs services).
 */
export async function fetchSalesStats() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}`, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}