import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/components/sections/ProductsPreviewSection.module.css';
import { fetchCategories } from '../../api/categories';
import { fetchServiceTypes } from '../../api/serviceTypes';

const ProductsPreviewSection = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const [items, setItems] = useState([]);

  useEffect(() => {
    Promise.all([
      fetchCategories(),
      fetchServiceTypes()
    ])
      .then(([categoriesData, serviceTypesData]) => {
        const mappedCategories = categoriesData.map(cat => ({ ...cat, type: 'category' }));
        const mappedServiceTypes = serviceTypesData.map(type => ({ ...type, type: 'serviceType' }));

        setItems([...mappedCategories, ...mappedServiceTypes]);
      })
      .catch(err => console.error('Erreur chargement catégories/types :', err));
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredItems = items
    .filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <section className={styles.previewSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.title}>Explorer par catégorie ou type</h2>
      </div>

      <div className={styles.searchFilterContainer}>
        <input
          type="text"
          placeholder="Rechercher par nom"
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.categoriesTypesGrid}>
        {filteredItems.map((item) => (
          <div key={item.id + item.type} className={styles.categoryTypeCard}>
            <div className={styles.cardTypeLabel}>
               {item.type === 'category' ? 'Catégorie' : 'Type de Service'}
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.itemName}>{item.name}</h3>
              {item.description && <p className={styles.itemDescription}>{item.description}</p>}
            </div>
            <Link
              to={item.type === 'category' ? `/products?category=${item.id}` : `/services?type=${item.id}`}
              className={styles.viewItemsButton}
            >
              Voir les offres
              <span className={styles.arrow}>→</span>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductsPreviewSection;