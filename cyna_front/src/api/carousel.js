// src/api/carousel.js
import { API_BASE_URL } from './config';
const BASE_URL = `${API_BASE_URL}/api/carousel`;

export async function fetchCarousel() {
  const token = localStorage.getItem('token');
  const res = await fetch(BASE_URL, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}