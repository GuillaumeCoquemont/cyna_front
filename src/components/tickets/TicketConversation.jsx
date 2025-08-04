import React, { useState, useEffect } from 'react';
import { fetchTicketMessages, addTicketMessage } from '../../api/ticketMessages';
import styles from '../../styles/components/tickets/TicketConversation.module.css';

const TicketConversation = ({ ticket, onClose, userRole }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMessages();
  }, [ticket.id]);

  const loadMessages = async () => {
    try {
      const data = await fetchTicketMessages(ticket.id);
      setMessages(data);
    } catch (err) {
      console.error('Erreur lors du chargement des messages:', err);
      setError('Impossible de charger les messages');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setLoading(true);
    setError('');

    try {
      const messageData = await addTicketMessage(ticket.id, newMessage);
      setMessages(prev => [...prev, messageData]);
      setNewMessage('');
    } catch (err) {
      console.error('Erreur lors de l\'envoi:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      nouveau: '#17a2b8',
      ouvert: '#ffc107',
      en_cours: '#007bff',
      resolu: '#28a745',
      ferme: '#6c757d'
    };
    return colors[status] || '#6c757d';
  };

  const getStatusLabel = (status) => {
    const labels = {
      nouveau: 'Nouveau',
      ouvert: 'Ouvert',
      en_cours: 'En cours',
      resolu: 'Résolu',
      ferme: 'Fermé'
    };
    return labels[status] || status;
  };

  const canSendMessage = ticket.status !== 'ferme' || userRole === 'admin';

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.ticketInfo}>
            <h3>{ticket.subject}</h3>
            <span 
              className={styles.status}
              style={{ backgroundColor: getStatusColor(ticket.status) }}
            >
              {getStatusLabel(ticket.status)}
            </span>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.ticketDetails}>
          <p><strong>Type:</strong> {ticket.type}</p>
          <p><strong>Créé le:</strong> {formatDate(ticket.created_at || ticket.createdAt)}</p>
          <p><strong>Description initiale:</strong></p>
          <div className={styles.initialDescription}>
            {ticket.description}
          </div>
        </div>

        <div className={styles.messagesContainer}>
          <h4>Conversation</h4>
          {error && <div className={styles.error}>{error}</div>}
          
          <div className={styles.messagesList}>
            {messages.length === 0 ? (
              <p className={styles.noMessages}>Aucun message dans cette conversation</p>
            ) : (
              messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`${styles.message} ${message.is_admin ? styles.adminMessage : styles.userMessage}`}
                >
                  <div className={styles.messageHeader}>
                    <span className={styles.messageAuthor}>
                      {message.is_admin ? '👨‍💼 Admin' : '👤 Client'} - {message.user?.name}
                    </span>
                    <span className={styles.messageDate}>
                      {formatDate(message.created_at)}
                    </span>
                  </div>
                  <div className={styles.messageContent}>
                    {message.message}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {canSendMessage && (
          <form className={styles.replyForm} onSubmit={handleSendMessage}>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Tapez votre message..."
              className={styles.messageInput}
              rows="3"
              disabled={loading}
            />
            <button 
              type="submit" 
              className={styles.sendButton}
              disabled={loading || !newMessage.trim()}
            >
              {loading ? 'Envoi...' : 'Envoyer'}
            </button>
          </form>
        )}

        {!canSendMessage && (
          <div className={styles.closedMessage}>
            Ce ticket est fermé. Seuls les administrateurs peuvent ajouter des messages.
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketConversation; 