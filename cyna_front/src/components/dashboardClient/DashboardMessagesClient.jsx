import React, { useState, useEffect } from 'react';
import styles from '../../styles/components/dashboardClient/DashboardMessages.module.css';
import { fetchMessages, addMessage } from '../../api/messages';

export default function DashboardMessagesClient() {
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState({ sujet: '', message: '' });
  const [error, setError] = useState('');

  // Charger les tickets existants
  useEffect(() => {
    fetchMessages('tickets')
      .then(data => setTickets(data))
      .catch(console.error);
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.sujet.trim() || !form.message.trim()) {
      setError('Sujet et message sont requis.');
      return;
    }

        setError('');
    try {
      const now = new Date().toISOString().slice(0, 10);
      const newTicket = await addMessage('tickets', {
        sujet: form.sujet,
        expediteur: 'client@example.com',
        message: form.message,
        date: now,
        statut: 'Nouveau'
      });
      setTickets(prev => [...prev, newTicket]);
      setForm({ sujet: '', message: '' });
    } catch (err) {
      console.error(err);
      setError('Erreur lors de l\'envoi.');
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Support & Tickets</h3>
      <ul className={styles.list}>
        {tickets.map(t => (
          <li key={t.id} className={styles.item}>
            <div className={styles.header}>
              <span className={styles.subject}>{t.sujet}</span>
              <span className={styles.status}>{t.statut}</span>
            </div>
            <p className={styles.message}>{t.message}</p>
            <div className={styles.meta}>
              <span>{t.date}</span>
              <span>{t.expediteur}</span>
            </div>
          </li>
        ))}
      </ul>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h4 className={styles.formTitle}>Envoyer un nouveau ticket</h4>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.field}>
          <label>Sujet *</label>
          <input
            type="text"
            name="sujet"
            value={form.sujet}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.field}>
          <label>Message *</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className={styles.submitBtn}>
          Envoyer
        </button>
      </form>
    </div>
);
}