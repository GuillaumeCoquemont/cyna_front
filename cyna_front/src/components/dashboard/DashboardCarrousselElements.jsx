// This file contains the data for the carrousel elements in the dashboard.
import styles from '../../styles/components/dashboard/DashboardCarrousselElement.module.css';

import React, { useState, useEffect } from 'react';
import EditCarouselItemModal from '../modals/EditCarouselItemModal';
import AddCarouselItemModal from '../modals/AddCarouselItemModal';
import AddServiceModal from '../modals/AddServiceModal';
import { fetchProducts } from '../../api/products';
import { fetchCarousel } from '../../api/carousel';
import { fetchServices } from '../../api/services';

export const CarrouselEditor = () => {
  const [elements, setElements] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Charger la config du carousel + produits + services
  useEffect(() => {
    Promise.all([fetchCarousel(), fetchProducts(), fetchServices()])
      .then(([carouselConfig, products, services]) => {
        const merged = carouselConfig
          .map(c => {
            // try match product
            const prod = products.find(p => p.id === c.product_id);
            if (prod) return { ...prod, order: c.order, type: 'product' };
            // else try match service
            const serv = services.find(s => s.id === c.product_id);
            if (serv) return { ...serv, order: c.order, type: 'service' };
            return null;
          })
          .filter(Boolean)
          .sort((a, b) => a.order - b.order);
        setElements(merged);
        setAllServices(services);
      })
      .catch(err => console.error('Erreur chargement carrousel:', err));
  }, []);

  // Charger tous les produits pour le select d’ajout
  useEffect(() => {
    fetchProducts()
      .then(data => setAllProducts(data))
      .catch(err => console.error('Erreur fetchProducts allProducts:', err));
  }, []);

  const handleChange = (id, field, value) => {
    setElements(prev =>
      prev.map(el => (el.id === id ? { ...el, [field]: value } : el))
    );
  };

  const handleSave = async (updatedItem) => {
    // updatedItem contains product_id and new order
    const { product_id, order } = updatedItem;
    try {
      const response = await fetch(`/api/carousel/${product_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order }),
      });
      if (!response.ok) throw new Error(`Erreur ${response.status}`);
      const saved = await response.json();
      setElements(prev =>
        prev.map(el =>
          el.id === saved.product_id ? { ...el, order: saved.order } : el
        )
      );
      window.alert('Configuration du carrousel mise à jour');
    } catch (err) {
      console.error('Erreur lors de la mise à jour du carrousel:', err);
      window.alert('Impossible de sauvegarder la configuration du carrousel');
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/carousel/${id}`, { method: 'DELETE' });
      setElements(prev => prev.filter(el => el.id !== id));
    } catch (err) {
      console.error('Erreur suppression du carousel item:', err);
    }
  };

  const handleOpenModal = () => setShowAddModal(true);
  const handleCloseModal = () => setShowAddModal(false);

  const handleOpenServiceModal = () => setShowAddServiceModal(true);
  const handleCloseServiceModal = () => setShowAddServiceModal(false);

 // Ajout de gestion d'erreurs explicite dans handleAdd et handleAddService

const handleAdd = async (newItem) => {
  try {
    const payload = {
      product_id: parseInt(newItem.product_id, 10),
      order: parseInt(newItem.order, 10)
    };
    const response = await fetch('/api/carousel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Erreur lors de l’ajout');
    }
    const saved = await response.json();
    const prod = allProducts.find(p => p.id === saved.item_id);
    if (prod) {
      setElements(prev => [...prev, { ...prod, order: saved.order }]);
    }
    setShowAddModal(false);
  } catch (err) {
    console.error('Erreur ajout du carousel item:', err);
    alert(err.message); 
  }
};

const handleAddService = async (newItem) => {
  try {
    const payload = {
      service_id: parseInt(newItem.service_id, 10),
      order: parseInt(newItem.order, 10)
    };
    const response = await fetch('/api/carousel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Erreur lors de l’ajout');
    }
    const saved = await response.json();
    const serv = allServices.find(s => s.id === saved.item_id);
    if (serv) {
      setElements(prev => [...prev, { ...serv, order: saved.order, type: 'service' }]);
    }
    setShowAddServiceModal(false);
  } catch (err) {
    console.error('Erreur ajout du carousel service item:', err);
    alert(err.message);
  }
};

  const handleOpenEdit = item => {
    setSelectedItem(item);
    setShowEditModal(true);
  };
  const handleCloseEdit = () => {
    setSelectedItem(null);
    setShowEditModal(false);
  };

  return (
    <div className={styles.editorContainer}>
      

      <h2>Éditeur de Carrousel</h2>
      <button onClick={handleOpenModal} className={styles.addButton}>
        Ajouter un produit
      </button>
      <button onClick={handleOpenServiceModal} className={styles.addButton}>
        Ajouter un service
      </button>
      <table className={styles.summaryTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Image</th>
            <th>Ordre</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {elements.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                ) : (
                  <span>—</span>
                )}
              </td>
              <td>{item.order}</td>
              <td>
                <button onClick={() => handleOpenEdit(item)}>Modifier</button>
                <button onClick={() => handleDelete(item.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <EditCarouselItemModal
        isOpen={showEditModal}
        onClose={handleCloseEdit}
        item={selectedItem}
        onSave={async updated => {
          await handleSave(updated);
          handleCloseEdit();
        }}
      />
      <AddCarouselItemModal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        products={allProducts}
        onSave={handleAdd}
      />
      <AddServiceModal
        isOpen={showAddServiceModal}
        onClose={handleCloseServiceModal}
        services={allServices}
        onSave={handleAddService}
      />
    </div>
  );
};

export default CarrouselEditor;