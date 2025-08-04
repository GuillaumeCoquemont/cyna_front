// src/api/orderItems.js
import { API_BASE_URL } from './config';
const URL = `${API_BASE_URL}/order-items`;

/**
 * Récupère la liste des order items
 */
export async function fetchOrderItems() {
  const token = localStorage.getItem('token');
  const res = await fetch(URL, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}