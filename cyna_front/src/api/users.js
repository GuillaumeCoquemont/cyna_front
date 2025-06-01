// src/api/users.js
import { API_BASE_URL } from './config';
const USERS_URL = `${API_BASE_URL}/api/users`;
const ROLES_URL = `${API_BASE_URL}/api/roles`;

export async function fetchUsers() {
  const token = localStorage.getItem('token');
  const res = await fetch(USERS_URL, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

export async function fetchRoles() {
  const token = localStorage.getItem('token');
  const res = await fetch(ROLES_URL, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}