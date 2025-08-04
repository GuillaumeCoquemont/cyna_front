import { API_BASE_URL } from './config';

const BASE_URL = `${API_BASE_URL}/ticket`;

// Récupérer tous les messages d'un ticket
export const fetchTicketMessages = async (ticketId) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Vous devez être connecté pour voir les messages');
  }
  
  const response = await fetch(`${BASE_URL}/${ticketId}/messages`, {
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

// Ajouter un message à un ticket
export const addTicketMessage = async (ticketId, message) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Vous devez être connecté pour envoyer un message');
  }
  
  const response = await fetch(`${BASE_URL}/${ticketId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message })
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `Erreur ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
};

// Supprimer un message (admin seulement)
export const deleteTicketMessage = async (messageId) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Vous devez être connecté pour supprimer un message');
  }
  
  const response = await fetch(`${BASE_URL}/messages/${messageId}`, {
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