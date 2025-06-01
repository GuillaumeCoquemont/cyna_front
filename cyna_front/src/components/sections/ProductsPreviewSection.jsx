import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/components/sections/ProductsPreviewSection.module.css';
import { fetchProducts } from '../../api/products';

const ProductsPreviewSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState(null);

  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    fetchProducts()
      .then(data => setFeaturedProducts(data))
      .catch(err => console.error('Erreur fetchProducts:', err));
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (order) => {
    setSortOrder(order);
  };

  const filteredProducts = featuredProducts
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "asc") return a.price - b.price;
      if (sortOrder === "desc") return b.price - a.price;
      return 0;
    });

  return (
    <section className={styles.previewSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.title}>Catégorie de produits</h2>
      </div>

      <div className={styles.searchFilterContainer}>
        <input
          type="text"
          placeholder="Rechercher"
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
        <button onClick={() => handleSort("asc")} className={styles.filterBtn}>
          Prix croissant
        </button>
        <button onClick={() => handleSort("desc")} className={styles.filterBtn}>
          Prix décroissant
        </button>
      </div>

      <div className={styles.productsGrid}>
        {filteredProducts.map((product) => (
          <div key={product.id} className={styles.productCard}>
            <div className={styles.productImage}>
              {product.discount && (
                <span className={styles.saleTag}>-{product.discount}%</span>
              )}
            </div>
            <div className={styles.productInfo}>
              <span className={styles.category}>{product.category}</span>
              <h3 className={styles.productTitle}>{product.name}</h3>
              <p className={styles.description}>{product.description}</p>
              <div className={styles.priceContainer}>
                <span className={styles.price}>${Number(product.price).toFixed(2)}</span>
                {product.price != null && product.discount && (
                  <span className={styles.originalPrice}>
                    ${((product.price / (1 - product.discount / 100)) || 0).toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.ctaContainer}>
        <Link to="/products" className={styles.viewAllButton}>
          Voir tous nos produits
          <span className={styles.arrow}>→</span>
        </Link>
      </div>
    </section>
  );
};

export default ProductsPreviewSection;