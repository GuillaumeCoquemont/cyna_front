import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/components/sections/ProductsTop.module.css';
import { fetchProducts } from '../../api/products';


const ProductsTop = () => {
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    fetchProducts()
      .then(data => setTopProducts(data))
      .catch(err => console.error('Erreur fetchProducts:', err));
  }, []);

  return (
    <section className={styles.topSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.title}>Les tops produits du moment</h2>
      </div>

      <div className={styles.productsGrid}>
        {topProducts.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className={styles.productLink}
          >
            <div className={styles.productCard}>
            <div className={styles.productImage}>
              {product.isNew && (
                <span className={`${styles.label} ${styles.labelNew}`}>Nouveau</span>
              )}
              {product.isTrending && (
                <span className={`${styles.label} ${styles.labelTrending}`}>Produit du moment</span>
              )}
              <img src={product.image} alt={product.name} className={styles.productImageTag} />
            </div>
            <div className={styles.productInfo}>
              <h3 className={styles.productTitle}>{product.name}</h3>
              <p className={styles.productDesc}>{product.description}</p>
              <p className={styles.price}>
                ${Number(product.price).toFixed(2)}
</p>
            </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ProductsTop;
