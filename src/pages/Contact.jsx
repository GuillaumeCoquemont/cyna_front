import React, { useState } from 'react';
import styles from '../styles/pages/Contact.module.css';
import { sendContactMessage } from '../api/contact';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

export default function ContactPage() {
  const [formData, setFormData] = useState({ subject: '', name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    
    try {
      const response = await sendContactMessage({
        subject: formData.subject,
        name: formData.name,
        email: formData.email,
        message: formData.message
      });
      
      setFormData({ subject: '', name: '', email: '', message: '' });
      setSuccess('Message envoyé avec succès ! Un ticket a été créé et notre équipe vous répondra bientôt.');
      
      // Optionnel : afficher le numéro de ticket
      if (response.ticket) {
        console.log('Ticket créé:', response.ticket.id);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Échec de l\'envoi, veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    //<Layout>
      <main className={styles.container}>
        <h1>Contactez-nous</h1>
        <div className={styles.grid}>
          <div className={styles.info}>
            <h2>Nos coordonnées</h2>
            <p>Pour toute question, contactez-nous :</p>
            <ul>
              <li><strong>Adresse :</strong> 11 Av. Dubonnet, 92400 Courbevoie</li>
              <li><strong>Téléphone :</strong> <a href="tel:+33189701436">01 89 70 14 36</a></li>
              <li><strong>Email :</strong> <a href="mailto:contact@cyna.fr">contact@cyna.fr</a></li>
              <li><strong>Horaires :</strong> Lun–Ven, 9h–18h</li>
            </ul>
            <p>Nous sommes à votre écoute du lundi au vendredi.</p>
          </div>
          <div className={styles.formWrapper}>
            {success && (
              <div className={styles.successMessage}>
                {success}
              </div>
            )}
            <form className={styles.form} onSubmit={handleSubmit}>
              <label>
                Sujet
                <div className={styles.selectWrapper}>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className={styles.select}
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="commande">Demande informations</option>
                    <option value="reclamation">Ticket de support</option>
                    <option value="autre">Autre</option>
                  </select>
                  <FontAwesomeIcon icon={faChevronDown} className={styles.selectIcon} />
                </div>
              </label>
              <label>
                Nom
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Votre nom"
                  required
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Votre email"
                  required
                />
              </label>
              <label>
                Message
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Votre message"
                  required
                ></textarea>
              </label>
              <button type="submit" disabled={loading}>
                {loading ? 'Envoi en cours...' : 'Envoyer'}
              </button>
            </form>
          </div>
        </div>
      </main>
  );
}
