import React from 'react';

const EditProductModal = ({ isOpen, onClose, onSubmit, product }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Modifier le produit</h2>
        <form onSubmit={onSubmit}>
          {/* Ajoutez ici les champs du formulaire pré-remplis avec les données du produit */}
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Annuler</button>
            <button type="submit">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal; 