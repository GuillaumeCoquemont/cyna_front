// src/api/auth.js
export async function login({ username, password }) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) throw new Error('Échec de la connexion');
  return res.json(); // { token }
}

export async function fetchMe(token) {
  const res = await fetch('/api/auth/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Token invalide');
  return res.json(); // { username, role }
}

export async function register({ username, password }) {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) throw new Error("Échec de l'inscription");
  return res.json();
}