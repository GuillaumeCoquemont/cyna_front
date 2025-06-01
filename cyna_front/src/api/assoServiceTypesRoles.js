// src/api/assoServiceTypesRoles.js
import { API_BASE_URL } from './config';
const URL = `${API_BASE_URL}/api/asso-servicetypes-roles`;

/**
 * Récupère toutes les associations service_type_id ↔ role_id
 */
export async function fetchServiceTypeRoleLinks() {
  const token = localStorage.getItem('token');
  const res = await fetch(URL, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

/**
 * Crée une association { service_type_id, role_id }
 */
export async function addServiceTypeRoleLink(serviceTypeId, roleId) {
  const token = localStorage.getItem('token');
  const res = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify({ service_type_id: serviceTypeId, role_id: roleId })
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

/**
 * Supprime l’association identifiée par (serviceTypeId, roleId)
 */
export async function deleteServiceTypeRoleLink(serviceTypeId, roleId) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${URL}/${serviceTypeId}/${roleId}`, {
    method: 'DELETE',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return;
}