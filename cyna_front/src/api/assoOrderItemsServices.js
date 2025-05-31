// src/api/assoOrderItemsServices.js
import { API_BASE_URL } from './config';
const URL = `${API_BASE_URL}/api/asso-orderitems-services`;

/**
 * Récupère toutes les associations order_item_id ↔ service_id
 */
export async function fetchOrderItemServiceLinks() {
  const res = await fetch(URL);
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

/**
 * Crée une association { order_item_id, service_id }
 */
export async function addOrderItemServiceLink(orderItemId, serviceId) {
  const res = await fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ order_item_id: orderItemId, service_id: serviceId })
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

/**
 * Supprime l’association identifiée par (orderItemId, serviceId)
 */
export async function deleteOrderItemServiceLink(orderItemId, serviceId) {
  const res = await fetch(`${URL}/${orderItemId}/${serviceId}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return;
}