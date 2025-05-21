// src/api/services.js

const BASE_URL = '/api/services';

// GET all services
export async function fetchServices() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

// PUT update a service by key
export async function updateService(key, data) {
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(key)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

// DELETE a service by key
export async function deleteService(key) {
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(key)}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return;
}

// POST add a new service
export async function addService(data) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

// GET all service types
export async function fetchServiceTypes() {
  const res = await fetch('/api/service-types');
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}