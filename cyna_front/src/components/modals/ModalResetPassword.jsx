import React from 'react';
import styles from '../../styles/components/modals/ModalResetPassword.module.css';

export default function ModalResetPassword({
  show,
  onClose,
  onConfirm,
  loading,
  newPassword,
  setNewPassword,
  error,
  success
}) {
  if (!show) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h4>Réinitialiser le mot de passe</h4>
        <input
          type="password"
          placeholder="Nouveau mot de passe"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          className={styles.input}
        />
        <div className={styles.actions}>
          <button
            className={styles.confirmButton}
            onClick={onConfirm}
            disabled={loading || !newPassword}
          >
            Confirmer
          </button>
          <button
            className={styles.cancelButton}
            onClick={onClose}
            disabled={loading}
          >
            Annuler
          </button>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}
      </div>
    </div>
  );
}
