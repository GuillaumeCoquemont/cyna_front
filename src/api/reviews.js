import { API_BASE_URL } from './config';

const BASE_URL = `${API_BASE_URL}/reviews`;

// Récupérer tous les avis
export const fetchAllReviews = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${BASE_URL}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`Erreur ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
};

// Récupérer les avis d'un produit
export const fetchProductReviews = async (productId) => {
  const response = await fetch(`${BASE_URL}/product/${productId}`);
  
  if (!response.ok) {
    throw new Error(`Erreur ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
};

// Récupérer les avis d'un service
export const fetchServiceReviews = async (serviceId) => {
  const response = await fetch(`${BASE_URL}/service/${serviceId}`);
  
  if (!response.ok) {
    throw new Error(`Erreur ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
};

// Récupérer les statistiques d'avis d'un produit
export const fetchProductReviewStats = async (productId) => {
  const response = await fetch(`${BASE_URL}/product/${productId}/stats`);
  
  if (!response.ok) {
    throw new Error(`Erreur ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
};

// Récupérer les statistiques d'avis d'un service
export const fetchServiceReviewStats = async (serviceId) => {
  const response = await fetch(`${BASE_URL}/service/${serviceId}/stats`);
  
  if (!response.ok) {
    throw new Error(`Erreur ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
};

// Créer un nouvel avis
export const createReview = async (reviewData) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Vous devez être connecté pour laisser un avis');
  }
  
  const response = await fetch(`${BASE_URL}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(reviewData)
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `Erreur ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
};

// Modifier un avis
export const updateReview = async (reviewId, reviewData) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Vous devez être connecté pour modifier un avis');
  }
  
  const response = await fetch(`${BASE_URL}/${reviewId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(reviewData)
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `Erreur ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
};

// Supprimer un avis
export const deleteReview = async (reviewId) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Vous devez être connecté pour supprimer un avis');
  }
  
  const response = await fetch(`${BASE_URL}/${reviewId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `Erreur ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
}; 