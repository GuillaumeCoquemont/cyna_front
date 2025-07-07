// src/api/carousel.js
import { API_BASE_URL } from './config';
const URL = `${API_BASE_URL}/carousel`;

export async function fetchCarousel() {
  const token = localStorage.getItem('token');
  const res = await fetch(URL, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}