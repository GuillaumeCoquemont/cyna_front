// src/api/orderItems.js
import { API_BASE_URL } from './config';
const URL = `${API_BASE_URL}/api/order-items`;

/**
 * Récupère la liste des order items
 */
export async function fetchOrderItems() {
  const res = await fetch(URL);
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}