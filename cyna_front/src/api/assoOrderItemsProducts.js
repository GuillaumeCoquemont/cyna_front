// src/api/assoOrderItemsProducts.js
import { API_BASE_URL } from './config';
const URL = `${API_BASE_URL}/api/asso-orderitems-products`;

/**
 * Récupère toutes les associations order_item_id ↔ product_id
 */
export async function fetchOrderItemProductLinks() {
  const res = await fetch(URL);
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

/**
 * Crée une association { order_item_id, product_id }
 */
export async function addOrderItemProductLink(orderItemId, productId) {
  const res = await fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ order_item_id: orderItemId, product_id: productId })
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

/**
 * Supprime l’association identifiée par (orderItemId, productId)
 */
export async function deleteOrderItemProductLink(orderItemId, productId) {
  const res = await fetch(`${URL}/${orderItemId}/${productId}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return;
}