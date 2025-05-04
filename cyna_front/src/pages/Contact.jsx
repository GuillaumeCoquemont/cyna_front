import React, { useState } from 'react';
import styles from '../styles/pages/Contact.module.css';

export default function ContactPage() {
  const [formData, setFormData] = useState({ subject: '', name: '', email: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Erreur lors de l’envoi du message');
      // Vous pouvez ajouter une alerte ou notification ici
      setFormData({ subject: '', name: '', email: '', message: '' });
    } catch (error) {
      console.error(error);
      alert('Échec de l’envoi, veuillez réessayer.');
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
              <li><strong>Adresse :</strong> 123 Rue de l'École, 75000 Paris</li>
              <li><strong>Téléphone :</strong> +33 1 23 45 67 89</li>
              <li><strong>Email :</strong> contact@example.com</li>
              <li><strong>Horaires :</strong> Lun–Ven, 9h–18h</li>
            </ul>
            <p>Nous sommes à votre écoute du lundi au vendredi.</p>
          </div>
          <div className={styles.formWrapper}>
            <form className={styles.form} onSubmit={handleSubmit}>
              <label>
                Sujet
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Sujet de votre demande"
                  required
                />
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
                />
              </label>
              <button type="submit">Envoyer</button>
            </form>
          </div>
        </div>
      </main>
  );
}
