import React, { useState } from 'react';
import { createTicket, TICKET_TYPES } from '../../api/tickets';
import { useAuth } from '../../context/AuthContext';
import styles from '../../styles/components/tickets/CreateTicketForm.module.css';

const CreateTicketForm = ({ onTicketCreated, onCancel }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    type: 'autre'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Effacer l'erreur quand l'utilisateur tape
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.subject.trim() || !formData.description.trim()) {
      setError('Le sujet et la description sont obligatoires');
      return;
    }

    if (formData.description.length < 10) {
      setError('La description doit contenir au moins 10 caractères');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const ticketData = {
        ...formData,
        user_id: user.id
      };

      const newTicket = await createTicket(ticketData);
      
      // Reset form
      setFormData({
        subject: '',
        description: '',
        type: 'autre'
      });

      // Notify parent component
      if (onTicketCreated) {
        onTicketCreated(newTicket);
      }

    } catch (err) {
      console.error('Erreur création ticket:', err);
      setError(err.message || 'Erreur lors de la création du ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <h2>Créer un nouveau ticket</h2>
        <p>Décrivez votre problème ou votre question, notre équipe vous répondra rapidement.</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="type" className={styles.label}>
            Type de demande *
          </label>
          <div className="selectWrapper">
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="select"
              required
            >
              {Object.entries(TICKET_TYPES).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <span className="selectIcon">▼</span>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="subject" className={styles.label}>
            Sujet *
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className={styles.input}
            placeholder="Résumez votre problème en quelques mots"
            maxLength="255"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.label}>
            Description détaillée *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={styles.textarea}
            placeholder="Décrivez votre problème en détail..."
            rows="6"
            minLength="10"
            maxLength="2000"
            required
          />
          <div className={styles.charCount}>
            {formData.description.length}/2000 caractères
          </div>
        </div>

        <div className={styles.formActions}>
          <button
            type="button"
            onClick={onCancel}
            className={styles.cancelButton}
            disabled={isSubmitting}
          >
            Annuler
          </button>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting || !formData.subject.trim() || !formData.description.trim()}
          >
            {isSubmitting ? (
              <span className={styles.loadingText}>
                <span className={styles.spinner}></span>
                Création...
              </span>
            ) : (
              'Créer le ticket'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTicketForm; 