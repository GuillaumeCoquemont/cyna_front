// src/api/orders.js

import { API_BASE_URL } from './config';
const CLIENT_PRODUCTS_URL = `${API_BASE_URL}/api/client/products`;
const CLIENT_SERVICES_URL = `${API_BASE_URL}/api/client/services`;
const BASE_URL = `${API_BASE_URL}/api/orders`;

// Fetch the list of client-facing products
export async function fetchClientProducts() {
  const res = await fetch(CLIENT_PRODUCTS_URL);
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

// Fetch the list of client-facing services
export async function fetchClientServices() {
  const res = await fetch(CLIENT_SERVICES_URL);
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

export async function fetchOrders() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

export async function addOrder(data) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

// Optionally, you can add order-related API calls here,
// for example to submit an order:
// export async function submitOrder(orderData) {
//   const res = await fetch('/api/orders', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(orderData),
//   });
//   if (!res.ok) throw new Error(`Erreur ${res.status}`);
//   return res.json();
// }