

import React, { useState, useEffect } from 'react';
//import api from '../../utils/api';
import styles from '../../styles/components/dashboard/DashboardCodePromo.module.css';

const DashboardCodePromo = () => {
  const [codes, setCodes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    code: '',
    discount: '',
    expires: ''
  });

  useEffect(() => {
    fetchCodes();
  }, []);

  const fetchCodes = async () => {
    try {
      const { data } = await api.get('/admin/promo-codes');
      setCodes(data);
    } catch (err) {
      console.error('Erreur fetching promo codes:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/promo-codes', form);
      setIsModalOpen(false);
      setForm({ code: '', discount: '', expires: '' });
      fetchCodes();
    } catch (err) {
      console.error('Erreur saving promo code:', err);
    }
  };

  const toggleModal = () => {
    setIsModalOpen(open => !open);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Codes promotionnels</h2>
        <button onClick={toggleModal} className={styles.addButton}>
          + Nouveau code
        </button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Code</th>
            <th>Remise (%)</th>
            <th>Expiration</th>
          </tr>
        </thead>
        <tbody>
          {codes.map((c) => (
            <tr key={c.id}>
              <td>{c.code}</td>
              <td>{c.discount}</td>
              <td>{new Date(c.expires).toLocaleDateString()}</td>
            </tr>
          ))}
          {codes.length === 0 && (
            <tr>
              <td colSpan="3">Aucun code disponible</td>
            </tr>
          )}
        </tbody>
      </table>

      {isModalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <h3>Ajouter un code promo</h3>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <label>Code</label>
                <input
                  type="text"
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.field}>
                <label>Remise (%)</label>
                <input
                  type="number"
                  name="discount"
                  value={form.discount}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.field}>
                <label>Expiration</label>
                <input
                  type="date"
                  name="expires"
                  value={form.expires}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.actions}>
                <button type="submit">Enregistrer</button>
                <button type="button" onClick={toggleModal}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

};

export default DashboardCodePromo;