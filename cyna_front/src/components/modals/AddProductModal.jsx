import React, { useState, useEffect } from 'react';
import { fetchCategories } from '../../api/categories';
import { fetchAvailablePromoCodes } from '../../api/products';
import styles from '../../styles/components/modals/ProductModal.module.css'

const ProductModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    stock: 0,
    price: 0,
    image: '',
    imageUrl: '',
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

  console.log('Codes promo chargés :', promoCodes);

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
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('category_id', formData.category_id);
      formDataToSend.append('promo_code_id', formData.promo_code_id || '');
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }
      if (formData.imageUrl.trim() !== '') {
        formDataToSend.append('imageUrl', formData.imageUrl.trim());
      }

      await onSave(formDataToSend, true);

      setFormData({
        name: '',
        stock: 0,
        price: 0,
        image: '',
        imageUrl: '',
        category_id: '',
        description: '',
        promo_code_id: ''
      });
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du produit:', error);
      alert('Une erreur est survenue lors de l\'ajout du produit. Veuillez réessayer.');
    }
  };

  return (
    <div className={styles['modal-overlay']}>
      <div className={styles['modal-content']}>
        <h2>Ajouter un produit</h2>
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
            <label>Ou URL de l'image</label>
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder=""
            />
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
              <span className="selectIcon">▼</span>
            </div>
          </div>
          
          <div className={styles['modal-actions']}>
            <button type="button" onClick={onClose}>Annuler</button>
            <button type="submit">Ajouter</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;