import React, { useState } from 'react';
import styles from '../../styles/components/Modals/ProductModal.module.css';

export default function ProductModal({ onClose, onSave }) {
  const [name, setName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [price, setPrice] = useState('');
  const [tag, setTag] = useState('nouveau');
  const [stock, setStock] = useState('');
  const [status, setStatus] = useState('en_stock');

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) setImageFile(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProduct = {
      id: Date.now(),
      name,
      price: parseFloat(price),
      tag,
      stock: parseInt(stock, 10),
      status,
      // optional: you can upload imageFile later
    };
    onSave(newProduct);
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Ajouter un produit</h3>
        <form className={styles.modalForm} onSubmit={handleSubmit}>
          <label>Nom du produit</label>
          <input
            type="text"
            placeholder="Nom..."
            value={name}
            onChange={e => setName(e.target.value)}
          />

          <label>Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />

          <label>Prix</label>
          <input
            type="number"
            placeholder="Prix..."
            value={price}
            onChange={e => setPrice(e.target.value)}
          />

          <label>Étiquette</label>
          <select value={tag} onChange={e => setTag(e.target.value)}>
            <option value="nouveau">Nouveau</option>
            <option value="top">Top produit</option>
          </select>

          <label>Stock</label>
          <input
            type="number"
            placeholder="Stock..."
            value={stock}
            onChange={e => setStock(e.target.value)}
          />

          <label>Statut</label>
          <select value={status} onChange={e => setStatus(e.target.value)}>
            <option value="en_stock">En stock</option>
            <option value="hors_stock">Hors stock</option>
          </select>

          <div className={styles.modalActions}>
            <button type="button" onClick={onClose}>Annuler</button>
            <button type="submit">Ajouter</button>
          </div>
        </form>
      </div>
    </div>
  );
}
