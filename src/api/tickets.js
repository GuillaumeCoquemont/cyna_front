import { API_BASE_URL } from './config';

const BASE_URL = `${API_BASE_URL}/tickets`;

// Récupérer tous les tickets (admin)
export const fetchAllTickets = async () => {
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

// Récupérer les tickets de l'utilisateur connecté
export const fetchUserTickets = async () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Vous devez être connecté pour voir vos tickets');
  }
  
  const response = await fetch(`${BASE_URL}/my-tickets`, {
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

// Récupérer un ticket par ID
export const fetchTicketById = async (ticketId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${BASE_URL}/${ticketId}`, {
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

// Créer un nouveau ticket
export const createTicket = async (ticketData) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Vous devez être connecté pour créer un ticket');
  }
  
  const response = await fetch(`${BASE_URL}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(ticketData)
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `Erreur ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
};

// Mettre à jour un ticket (admin)
export const updateTicket = async (ticketId, updateData) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Vous devez être connecté pour modifier un ticket');
  }
  
  const response = await fetch(`${BASE_URL}/${ticketId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updateData)
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `Erreur ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
};

// Supprimer un ticket (admin)
export const deleteTicket = async (ticketId) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Vous devez être connecté pour supprimer un ticket');
  }
  
  const response = await fetch(`${BASE_URL}/${ticketId}`, {
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

// Récupérer les statistiques des tickets (admin)
export const fetchTicketStats = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${BASE_URL}/stats`, {
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

// Constantes pour les types et statuts
export const TICKET_TYPES = {
  support_technique: 'Support technique',
  question_produit: 'Question produit',
  question_service: 'Question service',
  probleme_commande: 'Problème de commande',
  remboursement: 'Remboursement',
  autre: 'Autre'
};

export const TICKET_STATUS = {
  nouveau: 'Nouveau',
  ouvert: 'Ouvert',
  en_cours: 'En cours',
  resolu: 'Résolu',
  ferme: 'Fermé'
};

export const STATUS_COLORS = {
  nouveau: '#007bff',
  ouvert: '#ffc107',
  en_cours: '#17a2b8',
  resolu: '#28a745',
  ferme: '#6c757d'
}; 