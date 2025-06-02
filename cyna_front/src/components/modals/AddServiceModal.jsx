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
            <select
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
          </label>
          <label>
            Code promo
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