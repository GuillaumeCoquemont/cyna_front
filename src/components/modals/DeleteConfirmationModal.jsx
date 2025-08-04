import React from 'react';
import styles from '../../styles/components/modals/DeleteConfirmationModal.module.css';

export default function DeleteConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  itemName, 
  itemType, 
  dependencies,
  isLoading = false 
}) {
  if (!isOpen) return null;

  const hasWarnings = dependencies?.warnings?.length > 0;
  const canDelete = dependencies?.canDelete !== false;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>{canDelete ? 'Confirmer la suppression' : 'Suppression impossible'}</h3>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>
        
        <div className={styles.content}>
          <div className={styles.mainMessage}>
            <strong>
              {canDelete 
                ? `Êtes-vous sûr de vouloir supprimer ${itemType} "${itemName}" ?`
                : `Impossible de supprimer ${itemType} "${itemName}"`
              }
            </strong>
          </div>
          
          {isLoading && (
            <div className={styles.loading}>
              <span>Vérification des dépendances en cours...</span>
            </div>
          )}
          
          {!isLoading && hasWarnings && (
            <div className={canDelete ? styles.warningsSection : styles.blockedSection}>
              <h4 className={styles.warningTitle}>
                {canDelete ? '⚠️ Attention - Conséquences :' : '🚫 Raison du blocage :'}
              </h4>
              <ul className={styles.warningsList}>
                {dependencies.warnings.map((warning, index) => (
                  <li key={index} className={styles.warningItem}>
                    {warning}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {!isLoading && !hasWarnings && (
            <div className={styles.safeMessage}>
              ✅ Cette suppression n'affectera aucun autre élément.
            </div>
          )}
        </div>
        
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose}>
            {canDelete ? 'Annuler' : 'Fermer'}
          </button>
          {canDelete && (
            <button 
              className={hasWarnings ? styles.dangerBtn : styles.confirmBtn} 
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? 'Vérification...' : 
               hasWarnings ? 'Supprimer quand même' : 'Confirmer la suppression'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
