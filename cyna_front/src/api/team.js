import { API_BASE_URL } from './config';
const BASE_URL = `${API_BASE_URL}/api/team`;

export async function fetchTeam() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

export async function updateTeamMember(id, data) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

// Add this function:
export async function addTeamMember(data) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();

}

export async function deleteTeamMember(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return;
}