// src/api/userProfiles.js
import { API_BASE_URL } from './config';
const URL = `${API_BASE_URL}/api/user-profiles`;

/**
 * Récupère la liste des profils utilisateurs
 */
export async function fetchUserProfiles() {
  const res = await fetch(URL);
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}