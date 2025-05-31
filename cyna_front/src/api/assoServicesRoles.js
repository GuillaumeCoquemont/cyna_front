// src/api/assoServicesRoles.js
import { API_BASE_URL } from './config';
const URL = `${API_BASE_URL}/api/asso-services-roles`;

/**
 * Récupère toutes les associations service_id ↔ role_id
 */
export async function fetchServiceRoleLinks() {
  const res = await fetch(URL);
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

/**
 * Crée une association { service_id, role_id }
 */
export async function addServiceRoleLink(serviceId, roleId) {
  const res = await fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ service_id: serviceId, role_id: roleId })
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

/**
 * Supprime l’association identifiée par (serviceId, roleId)
 */
export async function deleteServiceRoleLink(serviceId, roleId) {
  const res = await fetch(`${URL}/${serviceId}/${roleId}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return;
}