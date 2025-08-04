import { API_BASE_URL } from './config';

const BASE_URL = `${API_BASE_URL}/payments`;

export async function fetchPaymentMethods() {
  const token = localStorage.getItem('token');
  const res = await fetch(BASE_URL, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

export async function addPaymentMethod(data) {
  const token = localStorage.getItem('token');
  console.log('Sending payment method data:', data);
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify(data),
  });
  const responseBody = await res.text(); // read raw text for better debugging
  if (!res.ok) {
    console.error('Backend returned error:', responseBody);
    throw new Error(`Erreur ${res.status}`);
  }
  return JSON.parse(responseBody); // parse manually since we used .text()
}

export async function updatePaymentMethod(id, data) {
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

export async function deletePaymentMethod(id) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return;
}