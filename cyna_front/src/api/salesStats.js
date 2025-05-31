// src/api/salesStats.js
import { API_BASE_URL } from './config';
const SALES_STATS_URL = `${API_BASE_URL}/api/admin`;

/**
 * Récupère les statistiques mensuelles (revenu produits vs services).
 */
export async function fetchSalesStats() {
  const res = await fetch(`${SALES_STATS_URL}/stats`);
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}