// src/api/orders.js

import { API_BASE_URL } from './config';

const BASE_URL = `${API_BASE_URL}/api/orders`;
const CLIENT_PRODUCTS_URL = `${API_BASE_URL}/api/products`;
const CLIENT_SERVICES_URL = `${API_BASE_URL}/api/services`;

// Fetch the list of client-facing products
export async function fetchClientProducts() {
  try {
    const res = await fetch(CLIENT_PRODUCTS_URL);
    if (!res.ok) {
      throw new Error(`Erreur ${res.status}: ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    throw error;
  }
}

// Fetch the list of client-facing services
export async function fetchClientServices() {
  try {
    const res = await fetch(CLIENT_SERVICES_URL);
    if (!res.ok) {
      throw new Error(`Erreur ${res.status}: ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error('Erreur lors de la récupération des services:', error);
    throw error;
  }
}

export async function fetchOrders() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token d\'authentification manquant');
    }

    const res = await fetch(BASE_URL, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      throw new Error(`Erreur ${res.status}: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    throw error;
  }
}

export async function fetchUserOrders(userId) {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token d\'authentification manquant');
    }

    const res = await fetch(`${BASE_URL}/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      throw new Error(`Erreur ${res.status}: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error(`Erreur lors de la récupération des commandes de l'utilisateur ${userId}:`, error);
    throw error;
  }
}

export async function addOrder(data) {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      throw new Error(`Erreur ${res.status}: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la commande:', error);
    throw error;
  }
}

export const updateOrderStatus = async (orderId, status) => {
    try {
        const response = await fetch(`${BASE_URL}/${orderId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ status })
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la mise à jour du statut');
        }

        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
};

// Optionally, you can add order-related API calls here,
// for example to submit an order:
// export async function submitOrder(orderData) {
//   const res = await fetch('/api/orders', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(orderData),
//   });
//   if (!res.ok) throw new Error(`Erreur ${res.status}`);
//   return res.json();
// }