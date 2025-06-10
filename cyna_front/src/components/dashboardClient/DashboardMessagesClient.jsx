import React, { useState, useEffect } from 'react';
import styles from '../../styles/components/dashboardClient/DashboardMessages.module.css';
import { fetchUserTickets, createTicket, TICKET_TYPES, TICKET_STATUS } from '../../api/tickets';
import TicketConversation from '../tickets/TicketConversation';

export default function DashboardMessagesClient() {
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState({ 
    subject: '', 
    description: '', 
    type: 'support_technique' 
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Charger les tickets existants
  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const data = await fetchUserTickets();
      setTickets(data);
    } catch (err) {
      console.error('Erreur lors du chargement des tickets:', err);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.subject.trim() || !form.description.trim()) {
      setError('Sujet et description sont requis.');
      return;
    }

    if (form.description.trim().length < 5) {
      setError('La description doit contenir au moins 5 caractères.');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const newTicket = await createTicket({
        subject: form.subject,
        description: form.description,
        type: form.type
      });
      
      setTickets(prev => [newTicket, ...prev]);
      setForm({ subject: '', description: '', type: 'support_technique' });
      setSuccess('Ticket créé avec succès !');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Erreur lors de la création du ticket.');
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

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Mes tickets de support</h3>
      
      {tickets.length > 0 ? (
        <ul className={styles.list}>
          {tickets.map(ticket => (
            <li key={ticket.id} className={styles.item}>
              <div className={styles.header}>
                <span className={styles.subject}>{ticket.subject}</span>
                <span className={`${styles.status} ${styles[ticket.status]}`}>
                  {getStatusLabel(ticket.status)}
                </span>
              </div>
              <p className={styles.message}>{ticket.description}</p>
              <div className={styles.meta}>
                <span>Créé le {formatDate(ticket.created_at || ticket.createdAt)}</span>
                <span>{getTypeLabel(ticket.type)}</span>
              </div>
              {ticket.admin_response && (
                <div className={styles.response}>
                  <strong>Réponse de l'équipe :</strong>
                  <p>{ticket.admin_response}</p>
                </div>
              )}
              <div className={styles.ticketActions}>
                <button 
                  className={styles.conversationButton}
                  onClick={() => setSelectedTicket(ticket)}
                >
                  💬 Voir la conversation
                  {ticket.messages && ticket.messages.some(msg => msg.is_admin) && (
                    <span className={styles.newMessageBadge}>●</span>
                  )}
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.emptyMessage}>Aucun ticket pour le moment</p>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <h4 className={styles.formTitle}>Créer un nouveau ticket</h4>
        
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}
        
        <div className={styles.field}>
          <label>Type de demande *</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            required
          >
            <option value="support_technique">Support technique</option>
            <option value="question_produit">Question sur un produit</option>
            <option value="question_service">Question sur un service</option>
            <option value="probleme_commande">Problème avec une commande</option>
            <option value="remboursement">Demande de remboursement</option>
            <option value="autre">Autre</option>
          </select>
        </div>

        <div className={styles.field}>
          <label>Sujet *</label>
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="Résumé de votre demande"
            required
          />
        </div>
        
        <div className={styles.field}>
          <label>Description *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Décrivez votre problème ou votre question en détail (minimum 5 caractères)..."
            rows="4"
            required
          />
        </div>
        
        <button 
          type="submit" 
          className={styles.submitBtn}
          disabled={loading}
        >
          {loading ? 'Création en cours...' : 'Créer le ticket'}
        </button>
      </form>

      {/* Composant de conversation */}
      {selectedTicket && (
        <TicketConversation 
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          userRole="user"
        />
      )}
    </div>
  );
}