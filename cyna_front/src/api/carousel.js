// src/api/carousel.js
export async function fetchCarousel() {
  const res = await fetch('/api/carousel');
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}