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

const API_BASE_URL = process.env.REACT_APP_API_URL;
const STATIC_URL = process.env.REACT_APP_STATIC_URL || "http://localhost:3007";

export default function ProductsEditor() {
  const [products, setProducts] = useState([]);
  const [newProd, setNewProd] = useState({
    name: '', description: '', characteristic: '', image: '', price: '', availability: ''
  });
  const [filterAvailability, setFilterAvailability] = useState('all');

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
  const handleUpdate = async (updatedProd, isMultipart = false) => {
    try {
      await updateProduct(updatedProd, isMultipart);
      load();
      handleCloseEdit();
    } catch (err) {
      console.error('Erreur lors de la mise à jour du produit:', err);
      alert('Erreur lors de la mise à jour du produit');
    }
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
  const handleAdd = async (newProdData, isMultipart) => {
    await addProduct(newProdData, isMultipart);
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

  const filteredProducts = tableProducts.filter(product => {
    if (filterAvailability === 'all') return true;
    if (filterAvailability === 'inStock') return product.stock > 0;
    if (filterAvailability === 'outOfStock') return product.stock === 0;
    if (filterAvailability === 'lowStock') return product.stock > 0 && product.stock < 5;
    return true;
  });

  return (
    <div className={styles.editorContainer}>
      <h2>Éditeur de Produits</h2>
      <div className={styles.filtersContainer}>
        <div className="selectWrapper">
          <select 
            className="select"
            value={filterAvailability}
            onChange={(e) => setFilterAvailability(e.target.value)}
          >
            <option value="all">Tous les produits</option>
            <option value="inStock">En stock</option>
            <option value="outOfStock">Rupture de stock</option>
            <option value="lowStock">Stock faible</option>
          </select>
          <span className="selectIcon">▼</span>
        </div>
        <button onClick={handleOpenAdd} className={styles.addButton}>
          Ajouter un produit
        </button>
      </div>
      <h3>Récapitulatif des produits</h3>
      <table className={styles.summaryTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
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
          {filteredProducts.map(p => {
            if (p.image && p.image.startsWith('/uploads/')) {
              const finalUrl = `${STATIC_URL}${p.image}`;
              console.log('STATIC_URL:', STATIC_URL, 'p.image:', p.image, 'URL finale:', finalUrl);
            } else {
              console.log('Image distante ou non disponible:', p.image);
            }
            return (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>
                  {p.image
                    ? <img
                        src={p.image.startsWith('/uploads/') ? `${STATIC_URL}${p.image}` : p.image}
                        alt={p.name}
                        style={{ maxWidth: 80, maxHeight: 80, objectFit: 'cover' }}
                      />
                    : <span>Image non disponible</span>
                  }
                </td>
                <td>{p.name}</td>
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
                    : (
                      <>
                        {p.stock}
                        {p.stock > 0 && p.stock < 5 && (
                          <span 
                            className={styles.lowStockIcon}
                            title="Stock faible"
                            style={{ display: 'inline-block' }}
                          >
                            {'\u26A0'}
                          </span>
                        )}
                      </>
                    )}
                </td>
                <td>
                  <button onClick={() => handleOpenEdit(p)}>Modifier</button>
                  <button onClick={() => handleDelete(p)}>Supprimer</button>
                </td>
              </tr>
            );
          })}
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