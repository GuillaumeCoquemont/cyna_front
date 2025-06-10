// src/components/modals/AddServiceModal.jsx

import React, { useState, useEffect } from 'react';
import { fetchServiceTypes } from '../../api/serviceTypes';
import { fetchPromoCodes } from '../../api/promoCodes';
import styles from '../../styles/components/modals/ServiceModal.module.css';

const AddServiceModal = ({ isOpen, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    status: false,
    price: '',
    subscription: false,
    subscriptionType: '',
    userCount: '',
    promotion: '',
    service_type_id: '',
    promo_code_id: ''
  });
  const [serviceTypes, setServiceTypes] = useState([]);
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setForm({
        name: '',
        description: '',
        status: false,
        price: '',
        subscription: false,
        subscriptionType: '',
        userCount: '',
        promotion: '',
        service_type_id: '',
        promo_code_id: ''
      });
      setImageFile(null);
      setImageUrl('');
      setImagePreview(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [types, codes] = await Promise.all([
          fetchServiceTypes(),
          fetchPromoCodes()
        ]);
        setServiceTypes(types);
        setPromoCodes(codes);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    };
    fetchData();
  }, []);

  if (!isOpen) return null;

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = e => {
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

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const formDataToSend = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });
    // Gestion image
    if (imageFile) {
      formDataToSend.append('image', imageFile);
    } else if (imageUrl.trim() !== '') {
      formDataToSend.append('image', imageUrl.trim());
    }
    await onSave(formDataToSend, true);
    setLoading(false);
    setForm({
      name: '',
      description: '',
      status: false,
      price: '',
      subscription: false,
      subscriptionType: '',
      userCount: '',
      promotion: '',
      service_type_id: '',
      promo_code_id: ''
    });
    setImageFile(null);
    setImageUrl('');
    onClose();
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <h2>Ajouter un service</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label>
            Nom
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </label>
          <label>
            Prix
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
          </label>
          <label>
            Type de service
            <div className="selectWrapper">
              <select
                className="select"
                name="service_type_id"
                value={form.service_type_id}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionner un type</option>
                {serviceTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              <span className="selectIcon">▼</span>
            </div>
          </label>
          <label>
            Code promo
            <div className="selectWrapper">
              <select
                className="select"
                name="promo_code_id"
                value={form.promo_code_id}
                onChange={handleChange}
              >
                <option value="">Aucun code promo</option>
                {promoCodes.map(code => (
                  <option key={code.id} value={code.id}>
                    {code.code} - {code.discountType === 'percentage' ? `${code.discountValue}%` : `${code.discountValue}€`}
                  </option>
                ))}
              </select>
              <span className="selectIcon">▼</span>
            </div>
          </label>
          <label>
            <input
              type="checkbox"
              name="status"
              checked={form.status}
              onChange={handleChange}
            />
            Actif
          </label>
          <label>
            <input
              type="checkbox"
              name="subscription"
              checked={form.subscription}
              onChange={handleChange}
            />
            Abonnement
          </label>
          {form.subscription && (
            <>
              <label>
                Type d'abonnement
                <input
                  type="text"
                  name="subscriptionType"
                  value={form.subscriptionType}
                  onChange={handleChange}
                />
              </label>
              <label>
                Nombre d'utilisateurs
                <input
                  type="number"
                  name="userCount"
                  value={form.userCount}
                  onChange={handleChange}
                  min="0"
                />
              </label>
            </>
          )}
          <label>
            Image (locale)
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                style={{ width: '100%', marginTop: '0.5rem', borderRadius: '4px' }}
              />
            )}
          </label>
          <label>
            Ou URL de l'image
            <input type="text" value={imageUrl} onChange={handleImageUrlChange} placeholder="https://..." />
          </label>
          <div className={styles.actions}>
            <button type="button" onClick={onClose}>Annuler</button>
            <button type="submit" disabled={loading}>
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddServiceModal;