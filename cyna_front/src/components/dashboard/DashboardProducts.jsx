import React, { useState, useEffect } from 'react';
import styles from '../../styles/components/dashboard/DashboardProducts.module.css';
import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct
} from '../../api/products';
import { calculateDiscountedPrice, formatPrice } from '../../utils/priceUtils';

import ProductEditModal from '../modals/EditProductModal';
import AddProductModal from '../modals/AddProductModal';

export default function ProductsEditor() {
  const [products, setProducts] = useState([]);
  const [newProd, setNewProd] = useState({
    name: '', description: '', characteristic: '', image: '', price: '', availability: ''
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProd, setSelectedProd] = useState(null);
  const [tableProducts, setTableProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = () => {
    fetchProducts()
      .then(data => {
        setProducts(data);
        setTableProducts(data);
      })
      .catch(err => console.error(err));
  };

  const handleOpenEdit = (prod) => {
    setSelectedProd(prod);
    setShowEditModal(true);
  };
  const handleCloseEdit = () => {
    setSelectedProd(null);
    setShowEditModal(false);
  };
  const handleUpdate = async (updatedProd) => {
    const payload = { ...updatedProd };
    if (payload.promoCodeId !== undefined) {
      payload.promo_code_id = payload.promoCodeId;
      delete payload.promoCodeId;
    }
    await updateProduct(updatedProd.id, payload);
    load();
    handleCloseEdit();
  };
  const handleDelete = async id => {
    console.log('Suppression demandée pour id :', id);
    console.log('Produits affichés :', tableProducts);
    try {
      await deleteProduct(id);
      setProducts(p => p.filter(prod => prod.id !== id));
      setTableProducts(prev => prev.filter(prod => prod.id !== id));
    } catch (err) {
      console.error('Erreur suppression produit:', err);
      alert('Erreur lors de la suppression du produit');
    }
  };

  const handleOpenAdd = () => setShowAddModal(true);
  const handleCloseAdd = () => setShowAddModal(false);
  const handleAdd = async (newProdData) => {
    const payload = { ...newProdData };
    if (payload.promoCodeId !== undefined) {
      payload.promo_code_id = payload.promoCodeId;
      delete payload.promoCodeId;
    }
    await addProduct(payload);
    load(); // recharge la liste depuis la BDD
    handleCloseAdd();
  };

  return (
    <div className={styles.editorContainer}>
      <h2>Éditeur de Produits</h2>
      <button onClick={handleOpenAdd} className={styles.addButton}>
        Ajouter un produit
      </button>
      <h3>Récapitulatif des produits</h3>
      <table className={styles.summaryTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Image</th>
            <th>Prix</th>
            <th>Prix après remise</th>
            <th>Code promo</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tableProducts.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>
                {p.name}
                {p.stock > 0 && p.stock < 5 && (
                  <span
                    className={styles.lowStockIcon}
                    title="Stock faible"
                  >
                    {'\u26A0'}
                  </span>
                )}
              </td>
              <td>
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                ) : (
                  <span>—</span>
                )}
              </td>
              <td>{formatPrice(p.price)}</td>
              <td>
                {p.promoCode ? (
                  <span style={{ color: 'var(--tertiary-color)' }}>
                    {formatPrice(calculateDiscountedPrice(p.price, p.promoCode))}
                  </span>
                ) : (
                  formatPrice(p.price)
                )}
              </td>
              <td>
                {p.promoCode ? (
                  <span>
                    {p.promoCode.code} ({p.promoCode.discountType === 'percentage' ? 
                      `${p.promoCode.discountValue}%` : 
                      `${p.promoCode.discountValue}€`})
                  </span>
                ) : (
                  '—'
                )}
              </td>
              <td>
                {p.stock === 0 
                  ? 'Rupture de stock' 
                  : p.stock}
              </td>
              <td>
                <button onClick={() => handleOpenEdit(p)}>Modifier</button>
                <button onClick={() => handleDelete(p.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ProductEditModal
        isOpen={showEditModal}
        onClose={handleCloseEdit}
        product={selectedProd}
        onSave={handleUpdate}
      />
      <AddProductModal
        isOpen={showAddModal}
        onClose={handleCloseAdd}
        onSave={handleAdd}
      />
    </div>
  );
}