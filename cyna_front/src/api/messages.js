// src/api/messages.js
import { API_BASE_URL } from './config';
const BASE_URL = `${API_BASE_URL}/api/messages`;

/**
 * Récupère la liste des messages pour un type donné:
 * @param {'mails'|'tickets'|'autres'} type
 */
export async function fetchMessages(type) {
  const res = await fetch(`${BASE_URL}/${type}`);
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

/** Ajoute un message */
export async function addMessage(type, data) {
  const res = await fetch(`${BASE_URL}/${type}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

/** Met à jour un message */
export async function updateMessage(type, id, data) {
  const res = await fetch(`${BASE_URL}/${type}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

/** Supprime un message */
export async function deleteMessage(type, id) {
  const res = await fetch(`${BASE_URL}/${type}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
}