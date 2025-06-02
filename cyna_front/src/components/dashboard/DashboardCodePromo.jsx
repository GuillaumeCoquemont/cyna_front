import React, { useState, useEffect } from 'react';
//import api from '../../utils/api';
import styles from '../../styles/components/dashboard/DashboardCodePromo.module.css';
import {
  fetchPromoCodes,
  addPromoCode,
  updatePromoCode,
  deletePromoCode
} from '../../api/promoCodes';
import AddPromoCodeModal from '../modals/AddPromoCodeModal';
import EditPromoCodeModal from '../modals/EditPromoCodeModal';

const DashboardCodePromo = () => {
  const [codes, setCodes] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [codeToEdit, setCodeToEdit] = useState(null);

  useEffect(() => {
    fetchCodes();
  }, []);

  const fetchCodes = async () => {
    try {
      const data = await fetchPromoCodes();
      setCodes(data);
    } catch (err) {
      console.error('Erreur fetching promo codes:', err);
    }
  };

  const handleEdit = (code) => {
    setCodeToEdit(code);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce code promo ?')) return;
    try {
      await deletePromoCode(id);
      fetchCodes();
    } catch (err) {
      console.error('Erreur suppression code promo:', err);
    }
  };

  const formatDiscount = (code) => {
    if (code.discountType === 'percentage') {
      return `${code.discountValue}%`;
    }
    return `${code.discountValue}€`;
  };

  const formatDate = (date) => {
    if (!date) return 'Non définie';
    return new Date(date).toLocaleDateString('fr-FR');
  };

  const getStatus = (code) => {
    if (!code.isActive) return 'Inactif';
    const now = new Date();
    if (code.startDate && new Date(code.startDate) > now) return 'Pas encore valide';
    if (code.endDate && new Date(code.endDate) < now) return 'Expiré';
    return 'Actif';
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Codes promotionnels</h2>
        <button onClick={() => setIsAddModalOpen(true)} className={styles.addButton}>
          + Nouveau code
        </button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Code</th>
            <th>Description</th>
            <th>Remise</th>
            <th>Validité</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {codes.map((c) => (
            <tr key={c.id}>
              <td>{c.code}</td>
              <td>{c.description || '-'}</td>
              <td>{formatDiscount(c)}</td>
              <td>
                {c.startDate && c.endDate ? (
                  `${formatDate(c.startDate)} - ${formatDate(c.endDate)}`
                ) : (
                  'Non définie'
                )}
              </td>
              <td>{getStatus(c)}</td>
              <td>
                <button onClick={() => handleEdit(c)} className={styles.editBtn}>Modifier</button>
                <button onClick={() => handleDelete(c.id)} className={styles.deleteBtn}>Supprimer</button>
              </td>
            </tr>
          ))}
          {codes.length === 0 && (
            <tr>
              <td colSpan="6">Aucun code disponible</td>
            </tr>
          )}
        </tbody>
      </table>

      <AddPromoCodeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchCodes}
      />

      <EditPromoCodeModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={fetchCodes}
        codeToEdit={codeToEdit}
      />
    </div>
  );
};

export default DashboardCodePromo;