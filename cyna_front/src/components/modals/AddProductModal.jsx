import React, { useState, useEffect } from 'react';
import { fetchCategories } from '../../api/categories';
import styles from '../../styles/components/modals/ProductModal.module.css'

const ProductModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({ name: '', stock: 0, price: 0, image: '', category_id: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  if (!isOpen) return null;

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'name' ? value : name === 'category_id' ? Number(value) : parseFloat(value)
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
    let payload = { ...formData };
    if (imageFile) {
      payload.image = await fileToBase64(imageFile);
    }
    onSave(payload);
    setFormData({ name: '', stock: 0, price: 0, image: '', category_id: '' });
    setImageFile(null);
    setImagePreview(null);
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
                  {cat.Name}
                </option>
              ))}
            </select>
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