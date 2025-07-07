// src/api/categories.js
import { API_BASE_URL } from './config';
const URL = `${API_BASE_URL}/product-categories`;

export async function fetchCategories() {
  try {
    const res = await fetch(URL);
    if (!res.ok) throw new Error(`Erreur ${res.status}`);
    return res.json();
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    return [];
  }
}

export async function addCategory(data) {
  const token = localStorage.getItem('token');
  const res = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type':'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

export async function updateCategory(id, data) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type':'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}

export async function deleteCategory(id) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${URL}/${id}`, {
    method: 'DELETE',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
}

export async function checkProductCategoryDependencies(id) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${URL}/${id}/dependencies`, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.json();
}