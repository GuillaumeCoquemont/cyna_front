import React, { useState, useEffect } from 'react';
import { fetchCategories } from '../../api/categories';
import { fetchAvailablePromoCodes } from '../../api/products';
import styles from '../../styles/components/modals/EditProductModal.module.css';

const EditProductModal = ({ isOpen, onClose, onSave, product }) => {
  const [formData, setFormData] = useState({
    name: '',
    stock: 0,
    price: 0,
    image: '',
    category_id: '',
    description: '',
    promo_code_id: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [promoCodes, setPromoCodes] = useState([]);

  useEffect(() => {
    Promise.all([
      fetchCategories().then(setCategories).catch(() => setCategories([])),
      fetchAvailablePromoCodes().then(setPromoCodes).catch(() => setPromoCodes([]))
    ]);
  }, []);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        stock: product.stock || 0,
        price: product.price || 0,
        image: product.image || '',
        category_id: product.category_id || '',
        description: product.description || '',
        promo_code_id: product.promo_code_id || ''
      });
      setImagePreview(product.image || null);
    }
  }, [product]);

  if (!isOpen) return null;

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'category_id' || name === 'promo_code_id' ? Number(value)
             : name === 'stock' ? parseInt(value, 10)
             : name === 'price' ? parseFloat(value)
             : value
    }));
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const fileToBase64 = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleSubmit = async e => {
    e.preventDefault();
    let payload = { ...formData, id: product.id };
    if (imageFile) {
      payload.image = await fileToBase64(imageFile);
    }
    onSave(payload);
  };

  return (
    <div className={styles['modal-overlay']}>
      <div className={styles['modal-content']}>
        <h2>Modifier le produit</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles['form-group']}>
            <label>Nom</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles['form-group']}>
            <label>Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              required
            />
          </div>
          <div className={styles['form-group']}>
            <label>Prix (€)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className={styles['form-group']}>
            <label>Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                style={{ width: '100%', marginTop: '0.5rem', borderRadius: '4px' }}
              />
            )}
          </div>

          <div className={styles['form-group']}>
            <label>Catégorie</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionner</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className={styles['form-group']}>
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className={styles['form-group']}>
            <label>Code Promo</label>
            <select
              name="promo_code_id"
              value={formData.promo_code_id}
              onChange={handleChange}
            >
              <option value="">Aucun code promo</option>
              {promoCodes.map(promo => (
                <option key={promo.id} value={promo.id}>
                  {promo.code} - {promo.discountType === 'percentage' ? `${promo.discountValue}%` : `${promo.discountValue}€`}
                </option>
              ))}
            </select>
          </div>

          <div className={styles['modal-actions']}>
            <button type="button" onClick={onClose}>Annuler</button>
            <button type="submit">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;