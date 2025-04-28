import React, { useState, useEffect } from 'react';
import styles from '../../styles/components/Modals/ProductModal.module.css';

export default function EditProductModal({ productId, onClose, onSave }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [tag, setTag] = useState('nouveau');
  const [stock, setStock] = useState('');
  const [status, setStatus] = useState('en_stock');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    // Récupère les données du produit à modifier
    fetch(`/api/products/${productId}`)
      .then(res => res.json())
      .then(data => {
        setName(data.name);
        setPrice(data.price);
        setTag(data.tag);
        setStock(data.stock);
        setStatus(data.status);
        setImagePreview(data.imageUrl || '');
      })
      .catch(err => console.error('Erreur fetch produit:', err));
  }, [productId]);

  // Met à jour automatiquement le statut en fonction du stock
  useEffect(() => {
    if (stock === '') return; // champ vide, ne rien faire
    const qty = parseInt(stock, 10);
    setStatus(qty > 0 ? 'en_stock' : 'hors_stock');
  }, [stock]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('tag', tag);
    formData.append('stock', stock);
    formData.append('status', status);
    if (imageFile) {
      formData.append('image', imageFile);
    }
    fetch(`/api/products/${productId}`, {
      method: 'PUT',
      body: formData,
    })
      .then(res => res.json())
      .then(updated => {
        onSave(updated);
        onClose();
      })
      .catch(err => console.error('Erreur mise à jour produit:', err));
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Modifier le produit</h3>
        <form className={styles.modalForm} onSubmit={handleSubmit}>
          <label>Image</label>
          {imagePreview && (
            <img src={imagePreview} alt="Aperçu" style={{ maxWidth: '100%', marginBottom: '0.5rem' }} />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />

          <label>Nom du produit</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
          />

          <label>Prix</label>
          <input
            type="number"
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
            value={stock}
            onChange={e => setStock(e.target.value)}
          />

          <label>Statut (automatique)</label>
          <input
            type="text"
            value={status === 'en_stock' ? 'En stock' : 'Hors stock'}
            readOnly
            disabled
            style={{ backgroundColor: '#f0f0f0' }}
          />

          <div className={styles.modalActions}>
            <button type="button" onClick={onClose}>Annuler</button>
            <button type="submit">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  );
}