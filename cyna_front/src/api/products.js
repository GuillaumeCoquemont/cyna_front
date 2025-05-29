import { API_BASE_URL } from './config';
const BASE_URL = `${API_BASE_URL}/api/products`;
// src/api/products.js

export async function fetchProducts() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

export async function fetchProduct(id) {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

export async function updateProduct(id, data) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

export async function deleteProduct(id) {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return;
}

export async function addProduct(data) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}