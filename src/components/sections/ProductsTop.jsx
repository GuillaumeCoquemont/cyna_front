import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/components/sections/ProductsTop.module.css';


const ProductsTop = () => {
  const topProducts = [
    { id: 1, title: 'Produit A', description: 'Description du produit A', price: 49.99, isNew: true, isTrending: false },
    { id: 2, title: 'Produit B', description: 'Description du produit B', price: 59.99, isNew: false, isTrending: true },
    { id: 3, title: 'Produit C', description: 'Description du produit C', price: 39.99, isNew: true, isTrending: true },
    // Ajoutez d'autres produits au besoin
  ];

  return (
    <section className={styles.topSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.title}>Les tops produits du moment</h2>
      </div>

      <div className={styles.productsGrid}>
        {topProducts.map((product) => (
          <div key={product.id} className={styles.productCard}>
            <div className={styles.productImage}>
              {product.isNew && (
                <span className={`${styles.label} ${styles.labelNew}`}>Nouveau</span>
              )}
              {product.isTrending && (
                <span className={`${styles.label} ${styles.labelTrending}`}>Produit du moment</span>
              )}
              {/* À remplacer par <img src={...} alt={product.title} /> */}
            </div>
            <div className={styles.productInfo}>
              <h3 className={styles.productTitle}>{product.title}</h3>
              <p className={styles.productDesc}>{product.description}</p>
              <p className={styles.price}>${product.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductsTop;
