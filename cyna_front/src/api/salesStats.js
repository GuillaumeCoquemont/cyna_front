// src/api/salesStats.js
import { API_BASE_URL } from './config';

/**
 * Récupère les statistiques mensuelles (revenu produits vs services).
 */
export async function fetchSalesStats() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE_URL}/api/stats`, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}