import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from '../../styles/components/sections/ProductsPreviewSection.module.css';
import { fetchCategories } from '../../api/categories';
import { fetchServiceTypes } from '../../api/serviceTypes';

const ProductsPreviewSection = ({ initialCount = 8, incrementCount = 8 }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState([]);
  const [visibleItems, setVisibleItems] = useState(initialCount);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

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
    setVisibleItems(8);
  };

  const filteredItems = items
    .filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const displayedItems = filteredItems.slice(0, visibleItems);
  const hasMore = visibleItems < filteredItems.length;

  const loadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleItems(v => Math.min(v + incrementCount, filteredItems.length));
      setIsLoadingMore(false);
    }, 300);
  };

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
        {displayedItems.map((item) => (
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

      {hasMore && (
        <div className={styles.loadMoreContainer}>
          <button
            className={styles.loadMoreButton}
            onClick={loadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? 'Chargement…' : 'Voir plus'}
          </button>
        </div>
      )}
    </section>
  );
};

export default ProductsPreviewSection;

ProductsPreviewSection.propTypes = {
  initialCount: PropTypes.number,
  incrementCount: PropTypes.number,
};