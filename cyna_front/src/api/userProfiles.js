// src/api/userProfiles.js
import { API_BASE_URL } from './config';
const URL = `${API_BASE_URL}/api/user-profiles`;

/**
 * Récupère la liste des profils utilisateurs (admin)
 */
export async function fetchUserProfiles() {
  const token = localStorage.getItem('token');
  const res = await fetch(URL, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

/**
 * Récupère le profil de l'utilisateur connecté
 */
export async function fetchUserProfile() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE_URL}/api/profile`, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

/**
 * Met à jour le profil de l'utilisateur connecté
 */
export async function updateUserProfile(data) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE_URL}/api/profile`, {
    method: 'PATCH',
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
 * Change le mot de passe de l'utilisateur connecté
 */
export async function updatePassword(currentPassword, newPassword) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE_URL}/api/profile/password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}