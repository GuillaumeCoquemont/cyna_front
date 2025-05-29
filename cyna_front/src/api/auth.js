import { API_BASE_URL } from './config';
const BASE_URL = `${API_BASE_URL}/api/auth`;
// src/api/auth.js
export async function login({ username, password }) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) throw new Error('Échec de la connexion');
  return res.json(); // { token }
}

export async function fetchMe(token) {
  const res = await fetch(`${BASE_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Token invalide');
  return res.json(); // { username, role }
}

export async function register({ username, password }) {
  const res = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) throw new Error("Échec de l'inscription");
  return res.json();
}