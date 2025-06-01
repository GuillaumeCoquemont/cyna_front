import { API_BASE_URL } from './config';

const BASE_URL = `${API_BASE_URL}/api/addresses`;

export async function fetchAddresses() {
  const token = localStorage.getItem('token');
  const res = await fetch(BASE_URL, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

export async function addAddress(data) {
  const token = localStorage.getItem('token');
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type':'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

export async function updateAddress(id, data) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type':'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

export async function deleteAddress(id) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return;
}