import React, { useState, useEffect } from 'react';
import styles from '../../styles/components/dashboard/DashboardMessage.module.css';

import {
  fetchMessages,
  addMessage,
  updateMessage,
  deleteMessage
} from '../../api/messages';

const DashboardMessage = () => {
  const [activeTab, setActiveTab] = useState('mails');
  const [messages, setMessages] = useState({ mails: [], tickets: [], autres: [] });
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  // Charger les messages pour chaque onglet au montage
  useEffect(() => {
    ['mails', 'tickets', 'autres'].forEach(type => {
      fetchMessages(type)
        .then(data => setMessages(prev => ({ ...prev, [type]: data })))
        .catch(console.error);
    });
  }, []);

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

  return (
    <div className={styles.dashboardMessage}>
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'mails' ? styles.active : ''}`}
          onClick={() => setActiveTab('mails')}
        >
          Mails
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'tickets' ? styles.active : ''}`}
          onClick={() => setActiveTab('tickets')}
        >
          Tickets
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'autres' ? styles.active : ''}`}
          onClick={() => setActiveTab('autres')}
        >
          Autres
        </button>
      </div>
      <div className={styles.content}>
        {renderMessageList(activeTab)}
      </div>
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
    </div>
  );
};

export default DashboardMessage;