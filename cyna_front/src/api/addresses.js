import { API_BASE_URL } from './config';

const BASE_URL = `${API_BASE_URL}/api/addresses`;

export async function fetchAddresses() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

export async function addAddress(data) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

export async function updateAddress(id, data) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

export async function deleteAddress(id) {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return;
}