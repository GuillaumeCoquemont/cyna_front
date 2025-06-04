import React, { useState, useEffect } from 'react';
import styles from '../../styles/components/dashboard/DashboardProducts.module.css';
import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  checkProductDependencies
} from '../../api/products';
import { calculateDiscountedPrice, formatPrice } from '../../utils/priceUtils';

import ProductEditModal from '../modals/EditProductModal';
import AddProductModal from '../modals/AddProductModal';
import DeleteConfirmationModal from '../modals/DeleteConfirmationModal';

export default function ProductsEditor() {
  const [products, setProducts] = useState([]);
  const [newProd, setNewProd] = useState({
    name: '', description: '', characteristic: '', image: '', price: '', availability: ''
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProd, setSelectedProd] = useState(null);
  const [tableProducts, setTableProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    product: null,
    dependencies: null,
    isLoading: false
  });

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
  const handleDelete = async (product) => {
    try {
      // Ouvrir la modale avec état de chargement
      setDeleteModal({
        isOpen: true,
        product,
        dependencies: null,
        isLoading: true
      });

      // Vérifier les dépendances
      const dependencies = await checkProductDependencies(product.id);
      
      // Mettre à jour la modale avec les dépendances
      setDeleteModal({
        isOpen: true,
        product,
        dependencies,
        isLoading: false
      });
    } catch (err) {
      console.error('Erreur vérification dépendances:', err);
      setDeleteModal({ isOpen: false, product: null, dependencies: null, isLoading: false });
      alert('Erreur lors de la vérification des dépendances');
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

  const confirmDelete = async () => {
    try {
      await deleteProduct(deleteModal.product.id);
      setProducts(p => p.filter(prod => prod.id !== deleteModal.product.id));
      setTableProducts(prev => prev.filter(prod => prod.id !== deleteModal.product.id));
      closeDeleteModal();
    } catch (err) {
      console.error('Erreur suppression produit:', err);
      alert('Erreur lors de la suppression du produit');
    }
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, product: null, dependencies: null, isLoading: false });
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
            <th>Description</th>
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
              <td>{p.description}</td>
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
                <button onClick={() => handleDelete(p)}>Supprimer</button>
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
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        itemName={deleteModal.product?.name}
        itemType="le produit"
        dependencies={deleteModal.dependencies}
        isLoading={deleteModal.isLoading}
      />
    </div>
  );
}