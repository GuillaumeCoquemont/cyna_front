import React, { useState, useEffect } from 'react';
import { fetchServiceTypes } from '../../api/serviceTypes';
import { fetchPromoCodes } from '../../api/promoCodes';
import styles from '../../styles/components/modals/ServiceModal.module.css';

export default function EditServiceModal({ isOpen, onClose, onSave, service }) {
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
    promo_code_id: null
  });
  const [serviceTypes, setServiceTypes] = useState([]);
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (service) {
      setForm({
        name: service.name || '',
        description: service.description || '',
        status: service.status || false,
        price: service.price || '',
        subscription: service.subscription || false,
        subscriptionType: service.subscriptionType || '',
        userCount: service.userCount || '',
        promotion: service.promotion || '',
        service_type_id: service.service_type_id || '',
        promo_code_id: service.promo_code_id || null
      });
      setImageFile(null);
      setImageUrl('');
    }
  }, [service]);

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
      [name]: type === 'checkbox' ? checked 
             : name === 'promo_code_id' ? (value === '' ? null : value)
             : value
    }));
  };

  const handleFileChange = e => {
    setImageFile(e.target.files[0]);
  };

  const handleImageUrlChange = e => {
    setImageUrl(e.target.value);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const formDataToSend = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });
    formDataToSend.append('id', service?.id);
    // Gestion image
    if (imageFile) {
      formDataToSend.append('image', imageFile);
    } else if (imageUrl.trim() !== '') {
      formDataToSend.append('image', imageUrl.trim());
    }
    await onSave(formDataToSend, true);
    setLoading(false);
    onClose();
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <h3>Modifier le service</h3>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label>Nom *</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.field}>
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </div>
          <div className={styles.field}>
            <label>Statut *</label>
            <div className="selectWrapper">
              <select
                className="select"
                name="status"
                value={form.status ? "true" : "false"}
                onChange={e =>
                  setForm(prev => ({
                    ...prev,
                    status: e.target.value === "true"
                  }))
                }
                required
              >
                <option value="true">En service</option>
                <option value="false">Hors service</option>
              </select>
              <span className="selectIcon">▼</span>
            </div>
          </div>
          <div className={styles.field}>
            <label>Prix *</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.fieldCheckbox}>
            <label>
              <input
                type="checkbox"
                name="subscription"
                checked={form.subscription}
                onChange={handleChange}
              />
              Abonnement
            </label>
          </div>
          {form.subscription && (
            <div className={styles.field}>
              <label>Type d'abonnement</label>
              <input
                type="text"
                name="subscriptionType"
                value={form.subscriptionType}
                onChange={handleChange}
              />
            </div>
          )}
          <div className={styles.field}>
            <label>Nombre d'utilisateurs</label>
            <input
              type="number"
              name="userCount"
              value={form.userCount}
              onChange={handleChange}
            />
          </div>
          <div className={styles['form-group']}>
            <label>Type de service</label>
            <div className="selectWrapper">
              <select
                className="select"
                name="service_type_id"
                value={form.service_type_id}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionner</option>
                {serviceTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              <span className="selectIcon">▼</span>
            </div>
          </div>
          <div className={styles['form-group']}>
            <label>Code Promo</label>
            <div className="selectWrapper">
              <select
                className="select"
                name="promo_code_id"
                value={form.promo_code_id || ''}
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
          <label>
            Image (locale)
            <input type="file" accept="image/*" onChange={handleFileChange} />
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
}