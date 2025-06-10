const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3007';

// Récupérer tous les messages d'un ticket
export const fetchTicketMessages = async (ticketId) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Vous devez être connecté pour voir les messages');
  }
  
  const response = await fetch(`${API_BASE_URL}/api/ticket/${ticketId}/messages`, {
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
  
  const response = await fetch(`${API_BASE_URL}/api/ticket/${ticketId}/messages`, {
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
  
  const response = await fetch(`${API_BASE_URL}/api/messages/${messageId}`, {
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