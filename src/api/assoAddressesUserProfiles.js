// src/api/assoAddressesUserProfiles.js
import { API_BASE_URL } from './config';
const URL = `${API_BASE_URL}/asso-addresses-user-profiles`;

/**
 * Récupère toutes les associations address_id ↔ user_profile_id
 */
export async function fetchAddressUserProfileLinks() {
  const token = localStorage.getItem('token');
  const res = await fetch(URL, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

/**
 * Crée une association { address_id, user_profile_id }
 */
export async function addAddressUserProfileLink(addressId, userProfileId) {
  const token = localStorage.getItem('token');
  const res = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify({ address_id: addressId, user_profile_id: userProfileId })
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

/**
 * Supprime l’association identifiée par (addressId, userProfileId)
 */
export async function deleteAddressUserProfileLink(addressId, userProfileId) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${URL}/${addressId}/${userProfileId}`, {
    method: 'DELETE',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return;
}