import { API_BASE_URL } from './config';
const BASE_URL = `${API_BASE_URL}/service-types`;

/**
 * Fetch the list of service types from the backend.
 * @returns {Promise<Array<{ id: number, name: string, description: string }>>}
 * @throws {Error} if the response is not ok.
 */
export async function fetchServiceTypes() {
  const token = localStorage.getItem('token');
  const res = await fetch(BASE_URL, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

/**
 * Create a new service type.
 * @param {{ name: string, description?: string }} data
 */
export async function addServiceType(data) {
  const token = localStorage.getItem('token');
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

/**
 * Update an existing service type by ID.
 * @param {number} id
 * @param {{ name: string, description?: string }} data
 */
export async function updateServiceType(id, data) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

/**
 * Delete a service type by ID.
 * @param {number} id
 */
export async function deleteServiceType(id) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
}

/**
 * Check dependencies before deleting a service type.
 * @param {number} id
 */
export async function checkServiceTypeDependencies(id) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/${id}/dependencies`, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}
