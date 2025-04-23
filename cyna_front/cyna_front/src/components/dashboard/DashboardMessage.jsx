import React, { useState, useEffect } from 'react';

const MESSAGE_TYPES = {
  info: 'Demande d\'informations',
  sav: 'Support SAV',
  other: 'Autre',
};

const FAKE_MESSAGES = [
  {
    id: 1,
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean.dupont@example.com",
    subject: "Demande d'informations produit",
    text: "Bonjour, je souhaite obtenir plus d'informations sur votre produit.",
    createdAt: "2025-04-20T10:30:00Z",
    type: "info",
  },
  {
    id: 2,
    firstName: "Marie",
    lastName: "Martin",
    email: "marie.martin@example.com",
    subject: "Problème livraison commande #12345",
    text: "J'ai un problème avec ma commande #12345, la livraison est en retard.",
    createdAt: "2025-04-21T14:45:00Z",
    type: "sav",
  },
  {
    id: 3,
    firstName: "Paul",
    lastName: "Durand",
    email: "paul.durand@example.com",
    subject: "Retour expérience",
    text: "Bravo pour votre service, continuez comme ça!",
    createdAt: "2025-04-19T08:15:00Z",
    type: "other",
  },
  {
    id: 4,
    firstName: "Sophie",
    lastName: "Bernard",
    email: "sophie.bernard@example.com",
    subject: "Changement adresse de facturation",
    text: "Puis-je changer l'adresse de facturation pour ma commande?",
    createdAt: "2025-04-22T09:00:00Z",
    type: "info",
  },
];

const styles = {
  container: {
    padding: '1rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    maxWidth: '600px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '1rem',
    fontSize: '1.5rem',
    textAlign: 'center',
  },
  messagesList: {
    maxHeight: '300px',
    overflowY: 'auto',
    marginBottom: '1rem',
    border: '1px solid #eee',
    borderRadius: '4px',
    padding: '0.5rem',
    backgroundColor: '#fafafa',
  },
  messageItem: {
    padding: '0.5rem',
    borderBottom: '1px solid #ddd',
  },
  messageDate: {
    fontSize: '0.75rem',
    color: '#666',
  },
  messageText: {
    margin: '0.25rem 0 0',
  },
  inputContainer: {
    display: 'flex',
    gap: '0.5rem',
  },
  input: {
    flex: 1,
    padding: '0.5rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  button: {
    padding: '0 1rem',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: '1rem',
    cursor: 'pointer',
  },
};

const DashboardMessage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [filter, setFilter] = useState('info');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    // Chargement de faux messages pour aperçu en local
    setMessages(FAKE_MESSAGES);
  }, []);

  const handleSend = () => {
    const text = newMessage.trim();
    if (!text) return;
    const payload = { text };
    fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((saved) => {
        setMessages((prev) => [...prev, saved]);
        setNewMessage('');
      })
      .catch((err) => console.error('Erreur envoi message:', err));
  };

  const handleReply = () => {
    if (!replyText.trim() || !selectedMessage) return;
    // Simule l'envoi de la réponse
    console.log('Réponse envoyée à', selectedMessage.email, ':', replyText);
    setReplyText('');
    setSelectedMessage(null);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Messagerie</h2>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {Object.entries(MESSAGE_TYPES).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            style={{
              ...styles.button,
              backgroundColor: filter === key ? '#0056b3' : '#007bff'
            }}
          >
            {label}
          </button>
        ))}
      </div>
      {selectedMessage && (
        <div style={{
          padding: '1rem',
          border: '1px solid #007bff',
          borderRadius: '4px',
          marginBottom: '1rem',
          backgroundColor: '#f0f8ff',
        }}>
          <button onClick={() => setSelectedMessage(null)} style={{ marginBottom: '0.5rem', ...styles.button }}>
            ← Retour aux messages
          </button>
          <div style={{ marginBottom: '0.5rem' }}><strong>Nom :</strong> {selectedMessage.firstName} {selectedMessage.lastName}</div>
          <div style={{ marginBottom: '0.5rem' }}><strong>Email :</strong> {selectedMessage.email}</div>
          <div style={{ marginBottom: '0.5rem' }}><strong>Sujet :</strong> {selectedMessage.subject}</div>
          <div style={{ marginBottom: '1rem' }}><strong>Message :</strong> {selectedMessage.text}</div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="Votre réponse…"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              style={{ flex: 1, padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
            />
            <button onClick={handleReply} style={styles.button}>Envoyer réponse</button>
          </div>
        </div>
      )}
      <div style={styles.messagesList}>
        {messages
          .filter(({ type }) => (type || 'other') === filter)
          .map(({ id, firstName, lastName, email, subject, text, createdAt, type }) => (
          <div
            key={id}
            style={{ ...styles.messageItem, cursor: 'pointer' }}
            onClick={() => setSelectedMessage({ id, firstName, lastName, email, subject, text, createdAt, type })}
          >
            <div style={styles.messageDate}>
              {new Date(createdAt).toLocaleString('fr-FR')}
            </div>
            <div style={styles.messageText}>
              <strong>{MESSAGE_TYPES[type || 'other']}:</strong> {text}
            </div>
          </div>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Votre message…"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          style={styles.input}
        />
        <button onClick={handleSend} style={styles.button}>
          Envoyer
        </button>
      </div>
    </div>
  );
};

export default DashboardMessage;