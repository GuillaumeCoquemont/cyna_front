import React from 'react';

const ProductModal = ({ isOpen, onClose, onSubmit }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Ajouter un produit</h2>
        <form onSubmit={onSubmit}>
          {/* Ajoutez ici les champs du formulaire */}
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Annuler</button>
            <button type="submit">Ajouter</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal; 