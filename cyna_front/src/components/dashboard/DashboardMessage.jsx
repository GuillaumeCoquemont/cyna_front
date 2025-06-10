import React, { useState, useEffect } from 'react';
import styles from '../../styles/components/dashboard/DashboardMessage.module.css';

import {
  fetchMessages,
  addMessage,
  updateMessage,
  deleteMessage
} from '../../api/messages';

import {
  fetchAllTickets,
  updateTicket,
  deleteTicket,
  TICKET_STATUS,
  TICKET_TYPES
} from '../../api/tickets';
import { fetchContactTickets } from '../../api/contact';
import TicketConversation from '../tickets/TicketConversation';

const DashboardMessage = () => {
  const [activeTab, setActiveTab] = useState('mails');
  const [messages, setMessages] = useState({ mails: [], autres: [] });
  const [tickets, setTickets] = useState([]);
  const [contactTickets, setContactTickets] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationTicket, setConversationTicket] = useState(null);

  // Charger les données au montage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Charger les messages (mails et autres)
    ['mails', 'autres'].forEach(type => {
      fetchMessages(type)
        .then(data => setMessages(prev => ({ ...prev, [type]: data })))
        .catch(console.error);
    });

    // Charger les tickets
    try {
      const ticketsData = await fetchAllTickets();
      setTickets(ticketsData);
    } catch (error) {
      console.error('Erreur lors du chargement des tickets:', error);
    }

    // Charger les tickets de contact
    try {
      const contactTicketsData = await fetchContactTickets();
      setContactTickets(contactTicketsData);
    } catch (error) {
      console.error('Erreur lors du chargement des tickets de contact:', error);
    }
  };

  const handleTicketStatusChange = async (ticketId, newStatus) => {
    try {
      setLoading(true);
      const updatedTicket = await updateTicket(ticketId, { status: newStatus });
      setTickets(prev => prev.map(t => t.id === ticketId ? updatedTicket : t));
      setContactTickets(prev => prev.map(t => t.id === ticketId ? updatedTicket : t));
      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket(updatedTicket);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      alert('Erreur lors de la mise à jour du statut');
    } finally {
      setLoading(false);
    }
  };

  const handleTicketResponse = async (ticketId, response) => {
    try {
      setLoading(true);
      const updatedTicket = await updateTicket(ticketId, { 
        admin_response: response,
        status: TICKET_STATUS.EN_COURS
      });
      setTickets(prev => prev.map(t => t.id === ticketId ? updatedTicket : t));
      setSelectedTicket(updatedTicket);
      setReplyContent('');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la réponse:', error);
      alert('Erreur lors de l\'ajout de la réponse');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce ticket ?')) {
      return;
    }

    try {
      setLoading(true);
      await deleteTicket(ticketId);
      setTickets(prev => prev.filter(t => t.id !== ticketId));
      setContactTickets(prev => prev.filter(t => t.id !== ticketId));
      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket(null);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression du ticket');
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      [TICKET_STATUS.NOUVEAU]: 'Nouveau',
      [TICKET_STATUS.OUVERT]: 'Ouvert',
      [TICKET_STATUS.EN_COURS]: 'En cours',
      [TICKET_STATUS.RESOLU]: 'Résolu',
      [TICKET_STATUS.FERME]: 'Fermé'
    };
    return labels[status] || status;
  };

  const getTypeLabel = (type) => {
    const labels = {
      [TICKET_TYPES.SUPPORT_TECHNIQUE]: 'Support technique',
      [TICKET_TYPES.QUESTION_PRODUIT]: 'Question produit',
      [TICKET_TYPES.QUESTION_SERVICE]: 'Question service',
      [TICKET_TYPES.PROBLEME_COMMANDE]: 'Problème commande',
      [TICKET_TYPES.REMBOURSEMENT]: 'Remboursement',
      [TICKET_TYPES.AUTRE]: 'Autre'
    };
    return labels[type] || type;
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Date inconnue';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Date invalide';
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch {
      return 'Date invalide';
    }
  };

  // Compter les nouveaux messages (tickets avec statut 'nouveau')
  const getNewMailsCount = () => {
    return contactTickets.filter(ticket => ticket.status === 'nouveau').length;
  };

  // Compter les nouveaux tickets
  const getNewTicketsCount = () => {
    return tickets.filter(ticket => ticket.status === 'nouveau').length;
  };

  const renderMessageList = (messageType) => {
    const currentMessages = messages[messageType];

    if (currentMessages.length === 0) {
      return <p>Aucun message pour le moment</p>;
    }

    return (
      <div className={styles.messageList}>
        {currentMessages.map((msg) => (
          <div
            key={msg.id}
            className={styles.messageItem}
            onClick={() => setSelectedMessage(msg)}
          >
            <div className={styles.messageHeader}>
              <h3>{msg.sujet}</h3>
              <span className={styles.date}>{msg.date}</span>
            </div>
            <div className={styles.messageDetails}>
              <p className={styles.expediteur}>De: {msg.expediteur}</p>
              {msg.statut && <span className={styles.statut}>{msg.statut}</span>}
            </div>
            <div className={styles.messageContent}>
              <p>{msg.message}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderContactTicketList = () => {
    if (contactTickets.length === 0) {
      return <p>Aucun mail pour le moment</p>;
    }

    return (
      <div className={styles.messageList}>
        {contactTickets.map((ticket) => (
          <div
            key={ticket.id}
            className={`${styles.messageItem} ${ticket.status === 'nouveau' ? styles.newMessage : ''}`}
            onClick={() => setConversationTicket(ticket)}
          >
            <div className={styles.messageHeader}>
              <h3>{ticket.subject}</h3>
              <span className={styles.date}>{formatDate(ticket.created_at || ticket.createdAt)}</span>
            </div>
            <div className={styles.messageDetails}>
              <p className={styles.expediteur}>
                De: {ticket.user?.name} ({ticket.user?.email})
              </p>
              <span className={`${styles.statut} ${styles[ticket.status]}`}>
                {getStatusLabel(ticket.status)}
              </span>
            </div>
            <div className={styles.messageContent}>
              <p><strong>Type:</strong> {getTypeLabel(ticket.type)}</p>
              <p>{ticket.description}</p>
            </div>
            <div className={styles.ticketActions}>
              <select
                value={ticket.status}
                onChange={(e) => handleTicketStatusChange(ticket.id, e.target.value)}
                onClick={(e) => e.stopPropagation()}
                disabled={loading}
              >
                <option value={TICKET_STATUS.NOUVEAU}>Nouveau</option>
                <option value={TICKET_STATUS.OUVERT}>Ouvert</option>
                <option value={TICKET_STATUS.EN_COURS}>En cours</option>
                <option value={TICKET_STATUS.RESOLU}>Résolu</option>
                <option value={TICKET_STATUS.FERME}>Fermé</option>
              </select>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTicket(ticket.id);
                }}
                className={styles.deleteButton}
                disabled={loading}
              >
                Supprimer
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setConversationTicket(ticket);
                }}
                className={styles.conversationButton}
                disabled={loading}
              >
                💬 Répondre
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTicketList = () => {
    if (tickets.length === 0) {
      return <p>Aucun ticket pour le moment</p>;
    }

    return (
      <div className={styles.messageList}>
              {tickets.map((ticket) => (
        <div
          key={ticket.id}
          className={`${styles.messageItem} ${ticket.status === 'nouveau' ? styles.newMessage : ''}`}
          onClick={() => setSelectedTicket(ticket)}
        >
            <div className={styles.messageHeader}>
              <h3>{ticket.subject}</h3>
              <span className={styles.date}>{formatDate(ticket.created_at || ticket.createdAt)}</span>
            </div>
            <div className={styles.messageDetails}>
              <p className={styles.expediteur}>
                De: {ticket.user?.name} ({ticket.user?.email})
              </p>
              <span className={`${styles.statut} ${styles[ticket.status]}`}>
                {getStatusLabel(ticket.status)}
              </span>
            </div>
            <div className={styles.messageContent}>
              <p><strong>Type:</strong> {getTypeLabel(ticket.type)}</p>
              <p>{ticket.description}</p>
            </div>
            <div className={styles.ticketActions}>
              <select
                value={ticket.status}
                onChange={(e) => handleTicketStatusChange(ticket.id, e.target.value)}
                onClick={(e) => e.stopPropagation()}
                disabled={loading}
              >
                <option value={TICKET_STATUS.NOUVEAU}>Nouveau</option>
                <option value={TICKET_STATUS.OUVERT}>Ouvert</option>
                <option value={TICKET_STATUS.EN_COURS}>En cours</option>
                <option value={TICKET_STATUS.RESOLU}>Résolu</option>
                <option value={TICKET_STATUS.FERME}>Fermé</option>
              </select>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTicket(ticket.id);
                }}
                className={styles.deleteButton}
                disabled={loading}
              >
                Supprimer
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setConversationTicket(ticket);
                }}
                className={styles.conversationButton}
                disabled={loading}
              >
                💬 Conversation
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.dashboardMessage}>
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'mails' ? styles.active : ''}`}
          onClick={() => setActiveTab('mails')}
        >
          Mails ({contactTickets.length})
          {getNewMailsCount() > 0 && (
            <span className={styles.notificationBadge}>
              {getNewMailsCount()}
            </span>
          )}
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'tickets' ? styles.active : ''}`}
          onClick={() => setActiveTab('tickets')}
        >
          Tickets ({tickets.length})
          {getNewTicketsCount() > 0 && (
            <span className={styles.notificationBadge}>
              {getNewTicketsCount()}
            </span>
          )}
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'autres' ? styles.active : ''}`}
          onClick={() => setActiveTab('autres')}
        >
          Autres
        </button>
      </div>
      <div className={styles.content}>
        {activeTab === 'tickets' ? renderTicketList() : 
         activeTab === 'mails' ? renderContactTicketList() : 
         renderMessageList(activeTab)}
      </div>

      {/* Modal pour les messages classiques */}
      {selectedMessage && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button
              className={styles.closeButton}
              onClick={() => {
                setSelectedMessage(null);
                setReplyContent('');
              }}
            >
              ×
            </button>
            <h3>{selectedMessage.sujet}</h3>
            <span className={styles.date}>{selectedMessage.date}</span>
            <p className={styles.expediteur}>De: {selectedMessage.expediteur}</p>
            <div className={styles.messageContent}>
              <p>{selectedMessage.message}</p>
            </div>
            <textarea
              className={styles.replyArea}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Votre réponse..."
            />
            <button
              className={styles.sendButton}
              onClick={() => {
                console.log('Réponse envoyée:', replyContent);
                setReplyContent('');
                setSelectedMessage(null);
              }}
            >
              Envoyer
            </button>
          </div>
        </div>
      )}

      {/* Modal pour les tickets */}
      {selectedTicket && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button
              className={styles.closeButton}
              onClick={() => {
                setSelectedTicket(null);
                setReplyContent('');
              }}
            >
              ×
            </button>
            <h3>{selectedTicket.subject}</h3>
            <div className={styles.ticketInfo}>
              <p><strong>Type:</strong> {getTypeLabel(selectedTicket.type)}</p>
              <p><strong>Statut:</strong> {getStatusLabel(selectedTicket.status)}</p>
              <p><strong>Créé le:</strong> {formatDate(selectedTicket.createdAt)}</p>
              <p><strong>Client:</strong> {selectedTicket.user?.name} ({selectedTicket.user?.email})</p>
            </div>
            <div className={styles.messageContent}>
              <h4>Description du problème :</h4>
              <p>{selectedTicket.description}</p>
            </div>
            {selectedTicket.admin_response && (
              <div className={styles.adminResponse}>
                <h4>Votre réponse :</h4>
                <p>{selectedTicket.admin_response}</p>
              </div>
            )}
            <textarea
              className={styles.replyArea}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Votre réponse au client..."
            />
            <div className={styles.modalActions}>
              <button
                className={styles.sendButton}
                onClick={() => handleTicketResponse(selectedTicket.id, replyContent)}
                disabled={!replyContent.trim() || loading}
              >
                {loading ? 'Envoi...' : 'Envoyer la réponse'}
              </button>
              <select
                value={selectedTicket.status}
                onChange={(e) => handleTicketStatusChange(selectedTicket.id, e.target.value)}
                disabled={loading}
              >
                <option value={TICKET_STATUS.NOUVEAU}>Nouveau</option>
                <option value={TICKET_STATUS.OUVERT}>Ouvert</option>
                <option value={TICKET_STATUS.EN_COURS}>En cours</option>
                <option value={TICKET_STATUS.RESOLU}>Résolu</option>
                <option value={TICKET_STATUS.FERME}>Fermé</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Composant de conversation pour les tickets */}
      {conversationTicket && (
        <TicketConversation 
          ticket={conversationTicket}
          onClose={() => setConversationTicket(null)}
          userRole="admin"
        />
      )}
    </div>
  );
};

export default DashboardMessage;