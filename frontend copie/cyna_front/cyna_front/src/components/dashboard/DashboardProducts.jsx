import React, { useState } from 'react';
import styles from '../../styles/components/Dashboard/DashboardProducts.module.css';
import ProductModal from '../modals/ProductModal';

export default function DashboardProducts() {
  const [localProducts, setLocalProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleOpenModal = (prod = null) => {
    setSelectedProduct(prod);
    setShowModal(true);
  };
  const handleSaveLocal = (saved) => {
    if (selectedProduct) {
      // édition
      setLocalProducts(prev => prev.map(p => p.id === selectedProduct.id ? saved : p));
    } else {
      // ajout
      setLocalProducts(prev => [...prev, saved]);
    }
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleDeleteLocal = (id) => {
    setLocalProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className={styles.productsPage}>
      <h2>Liste des produits</h2>

      <div className={styles.actions}>
      <button className={styles.addButton} onClick={() => handleOpenModal(null)}>+ Ajouter un produit</button>
      </div>

      <table className={styles.productsTable}>
        <thead>
          <tr>
            <th>Produit</th>
            <th>Stock</th>
            <th>Prix</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {localProducts.length > 0 ? (
            localProducts.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.stock}</td>
                <td>{product.price}€</td>
                <td><span className={styles.statusInStock}>En stock</span></td>
                <td>
                  <button 
                    className={styles.editButton} 
                    onClick={() => handleOpenModal(product)}
                  >
                    Modifier
                  </button>
                  <button 
                    className={styles.deleteButton} 
                    onClick={() => handleDeleteLocal(product.id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '1rem' }}>
                Aucun produit disponible
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {showModal && (
        <ProductModal
          product={selectedProduct}
          onSave={handleSaveLocal}
          onClose={() => {
            setShowModal(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
}
