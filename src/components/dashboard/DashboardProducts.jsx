import React, { useState, useEffect } from 'react';
import styles from '../../styles/components/dashboard/DashboardProducts.module.css';
import ProductModal from '../modals/ProductModal';
import EditProductModal from '../modals/EditProductModal';

// Données factices pour test sans backend
const fakeProducts = [
  { id: 1, name: 'Produit Alpha', stock: 15, price: 19.99 },
  { id: 2, name: 'Produit Beta', stock: 0, price: 29.99 },
  { id: 3, name: 'Produit Gamma', stock: 5, price: 9.99 },
  { id: 4, name: 'Produit Delta', stock: 20, price: 49.99 }
];

const DashboardProducts = () => {
  const [productsList, setProductsList] = useState(fakeProducts);
  const [filters, setFilters] = useState({ name: '', stock: '', minPrice: '', maxPrice: '' });
  const [filteredProducts, setFilteredProducts] = useState(productsList);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    let result = productsList.filter(p =>
      p.name.toLowerCase().includes(filters.name.toLowerCase())
    );

    if (filters.stock) {
      result = result.filter(p =>
        filters.stock === 'in' ? p.stock > 0 : p.stock === 0
      );
    }
    if (filters.minPrice !== '') {
      result = result.filter(p => p.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice !== '') {
      result = result.filter(p => p.price <= parseFloat(filters.maxPrice));
    }
    setFilteredProducts(result);
  }, [filters, productsList]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleAdd = newProduct => {
    const id = productsList.length ? Math.max(...productsList.map(p => p.id)) + 1 : 1;
    setProductsList(prev => [...prev, { id, ...newProduct }]);
    setAddModalOpen(false);
  };

  const handleEdit = updatedProduct => {
    setProductsList(prev =>
      prev.map(p => (p.id === selectedProduct.id ? { ...p, ...updatedProduct } : p))
    );
    setEditModalOpen(false);
    setSelectedProduct(null);
  };

  const handleDelete = (id) => {
    setProductsList(prev => prev.filter(product => product.id !== id));
  };

  return (
    <div className={styles.dashboardProducts}>
      <h2>Produits</h2>
      <button className={styles.addButton} onClick={() => setAddModalOpen(true)}>
        + Ajouter un produit
      </button>

      <div className={styles.filters}>
        <input
          type="text"
          name="name"
          placeholder="Nom"
          value={filters.name}
          onChange={handleChange}
        />
        <select name="stock" value={filters.stock} onChange={handleChange}>
          <option value="">Tous</option>
          <option value="in">En stock</option>
          <option value="out">Rupture</option>
        </select>
        <input
          type="number"
          name="minPrice"
          placeholder="Prix min"
          value={filters.minPrice}
          onChange={handleChange}
        />
        <input
          type="number"
          name="maxPrice"
          placeholder="Prix max"
          value={filters.maxPrice}
          onChange={handleChange}
        />
      </div>

      <div className={styles.productsList}>
        {filteredProducts.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Disponibilité</th>
                <th>Stock</th>
                <th>Prix (€)</th>
                <th>Actions</th>
                <th>Supprimer</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td className={product.stock > 0 ? styles.inStock : styles.outOfStock}>
                    {product.stock > 0 ? 'En stock' : 'Rupture de stock'}
                  </td>
                  <td>{product.stock}</td>
                  <td>{product.price.toFixed(2)}</td>
                  <td>
                    <button
                      className={styles.editButton}
                      onClick={() => {
                        setSelectedProduct(product);
                        setEditModalOpen(true);
                      }}
                    >
                      Modifier
                    </button>
                  </td>
                  <td>
                    <button className={styles.deleteButton} onClick={() => handleDelete(product.id)}>
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Aucun produit pour le moment</p>
        )}
      </div>

      {/* Modales */}
      <ProductModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleAdd}
      />
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedProduct(null);
        }}
        onSubmit={handleEdit}
        product={selectedProduct}
      />
    </div>
  );
};

export default DashboardProducts;