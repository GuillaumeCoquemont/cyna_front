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
    promo_code_id: ''
  });
  const [serviceTypes, setServiceTypes] = useState([]);
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(false);

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
        promo_code_id: service.promo_code_id || ''
      });
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
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      ...form,
      status: !!form.status,
      subscription: !!form.subscription
    };
    await onSave(payload);
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
            <select
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
          <div className={styles.field}>
            <label>Promotion</label>
            <input
              type="text"
              name="promotion"
              value={form.promotion}
              onChange={handleChange}
            />
          </div>
          <div className={styles.field}>
            <label>Type de service *</label>
            <select
              name="service_type_id"
              value={form.service_type_id}
              onChange={handleChange}
              required
            >
              <option value="">-- Sélectionner --</option>
              {serviceTypes.map(st => (
                <option key={st.id} value={st.id}>
                  {st.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label>Code promo</label>
            <select
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
          </div>
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