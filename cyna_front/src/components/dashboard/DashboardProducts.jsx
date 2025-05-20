import React, { useState, useEffect } from 'react';
import styles from '../../styles/components/dashboard/DashboardProducts.module.css';
import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct
} from '../../api/products';

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
    await updateProduct(updatedProd.id, updatedProd);
    load();
    handleCloseEdit();
  };
  const handleDelete = async id => {
    await deleteProduct(id);
    setProducts(p => p.filter(prod => prod.id !== id));
    setTableProducts(prev => prev.filter(prod => prod.id !== id));
  };

  const handleOpenAdd = () => setShowAddModal(true);
  const handleCloseAdd = () => setShowAddModal(false);
  const handleAdd = async (newProdData) => {
    // Compute next available ID based on existing products
    const existingIds = products.map(p => p.id);
    const nextId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
    const payload = { ...newProdData, id: nextId };
    await addProduct(payload);
    load();
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
            <th>Prix</th>
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
              <td>{p.price}</td>
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