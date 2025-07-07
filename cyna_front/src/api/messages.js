import { API_BASE_URL } from './config';
const URL = `${API_BASE_URL}/messages`;

/**
 * Récupère la liste des messages pour un type donné:
 * @param {'mails'|'tickets'|'autres'} type
 */
export async function fetchMessages(type) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${URL}/${type}`, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

/** Ajoute un message */
export async function addMessage(type, data) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${URL}/${type}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

/** Met à jour un message */
export async function updateMessage(type, id, data) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${URL}/${type}/${id}`, {
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

/** Supprime un message */
export async function deleteMessage(type, id) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${URL}/${type}/${id}`, {
    method: 'DELETE',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
}