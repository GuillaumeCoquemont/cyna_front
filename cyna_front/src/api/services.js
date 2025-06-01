// src/api/services.js

import { API_BASE_URL } from './config';
const SERVICES_URL = `${API_BASE_URL}/api/services`;
const SERVICE_TYPES_URL = `${API_BASE_URL}/api/service-types`;

// GET all services
export async function fetchServices() {
  const token = localStorage.getItem('token');
  const res = await fetch(SERVICES_URL, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

// PUT update a service by key
export async function updateService(key, data) {
  const res = await fetch(`${SERVICES_URL}/${encodeURIComponent(key)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

// DELETE a service by key
export async function deleteService(key) {
  const res = await fetch(`${SERVICES_URL}/${encodeURIComponent(key)}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return;
}

// POST add a new service
export async function addService(data) {
  const res = await fetch(SERVICES_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

// GET all service types
export async function fetchServiceTypes() {
  const res = await fetch(SERVICE_TYPES_URL);
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}