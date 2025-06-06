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
    promo_code_id: null
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [promoCodes, setPromoCodes] = useState([]);
  const [imageUrl, setImageUrl] = useState('');

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
        promo_code_id: product.promo_code_id || null
      });
      setImagePreview(product.image || null);
      setImageUrl(product.image || '');
    }
  }, [product]);

  if (!isOpen) return null;

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'category_id' ? Number(value)
             : name === 'promo_code_id' ? (value === '' ? null : Number(value))
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
      setImageUrl(''); // Réinitialiser l'URL si on upload un fichier
    }
  };

  const handleImageUrlChange = e => {
    const url = e.target.value;
    setImageUrl(url);
    setImagePreview(url);
    setImageFile(null); // Réinitialiser le fichier si on met une URL
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    
    // Ajouter les champs de base
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('stock', formData.stock);
    formDataToSend.append('category_id', formData.category_id);
    
    // Gérer le promo_code_id
    if (!formData.promo_code_id || formData.promo_code_id === '') {
      formDataToSend.append('promo_code_id', 'null');
    } else {
      formDataToSend.append('promo_code_id', formData.promo_code_id);
    }

    // Gérer l'image
    if (imageFile) {
      formDataToSend.append('image', imageFile);
    } else if (imageUrl) {
      formDataToSend.append('image', imageUrl);
    }

    // Ajouter l'ID du produit
    formDataToSend.append('id', product.id);

    onSave(formDataToSend, true);
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
            <div className={styles['image-inputs']}>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
              />
              <div className={styles['or-divider']}>ou</div>
              <input
                type="url"
                placeholder="URL de l'image"
                value={imageUrl}
                onChange={handleImageUrlChange}
              />
            </div>
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
            <div className="selectWrapper">
              <select
                className="select"
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
              <span className="selectIcon">▼</span>
            </div>
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
            <div className="selectWrapper">
              <select
                className="select"
                name="promo_code_id"
                value={formData.promo_code_id || ''}
                onChange={handleChange}
              >
                <option value="">Aucun code promo</option>
                {promoCodes.map(promo => (
                  <option key={promo.id} value={promo.id}>
                    {promo.code} - {promo.discountType === 'percentage' ? `${promo.discountValue}%` : `${promo.discountValue}€`}
                  </option>
                ))}
              </select>
              <span className="selectIcon">▼</span>
            </div>
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