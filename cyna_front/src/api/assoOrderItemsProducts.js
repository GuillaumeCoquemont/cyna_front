// src/api/assoOrderItemsProducts.js
import { API_BASE_URL } from './config';
const URL = `${API_BASE_URL}/api/asso-orderitems-products`;

/**
 * Récupère toutes les associations order_item_id ↔ product_id
 */
export async function fetchOrderItemProductLinks() {
  const token = localStorage.getItem('token');
  const res = await fetch(URL, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

/**
 * Crée une association { order_item_id, product_id }
 */
export async function addOrderItemProductLink(orderItemId, productId) {
  const token = localStorage.getItem('token');
  const res = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify({ order_item_id: orderItemId, product_id: productId })
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

/**
 * Supprime l’association identifiée par (orderItemId, productId)
 */
export async function deleteOrderItemProductLink(orderItemId, productId) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${URL}/${orderItemId}/${productId}`, {
    method: 'DELETE',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return;
}