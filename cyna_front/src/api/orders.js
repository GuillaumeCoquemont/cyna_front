

// src/api/orders.js

// Fetch the list of client-facing products
export async function fetchClientProducts() {
  const res = await fetch('/api/client/products');
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

// Fetch the list of client-facing services
export async function fetchClientServices() {
  const res = await fetch('/api/client/services');
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

const BASE = '/api/orders';

export async function fetchOrders() {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

export async function addOrder(data) {
  const res = await fetch(BASE, {
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