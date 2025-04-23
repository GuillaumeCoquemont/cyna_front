import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/components/sections/ProductsPreviewSection.module.css';

const ProductsPreviewSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState(null);

  const featuredProducts = [
    {
      id: 1,
      title: 'Antivirus Pro',
      description: 'Protection avancée contre les malwares',
      price: 199.99,
      discount: 15,
      category: 'Protection'
    },
    {
      id: 2,
      title: 'Firewall Enterprise',
      description: 'Sécurité réseau complète',
      price: 299.99,
      category: 'Réseau'
    },
    {
      id: 3,
      title: 'VPN Secure',
      description: 'Navigation sécurisée et privée',
      price: 149.99,
      discount: 20,
      category: 'Protection'
    },
    {
      id: 4,
      title: 'Email Shield',
      description: 'Protection contre le phishing et les spams',
      price: 99.99,
      category: 'Communication'
    },
    {
      id: 5,
      title: 'Data Backup',
      description: 'Sauvegarde automatique de vos fichiers critiques',
      price: 129.99,
      discount: 10,
      category: 'Stockage'
    },
    {
      id: 6,
      title: 'Endpoint Defender',
      description: 'Sécurisation des appareils connectés',
      price: 179.99,
      category: 'Appareils'
    }
  ];

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (order) => {
    setSortOrder(order);
  };

  const filteredProducts = featuredProducts
    .filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
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
              <h3 className={styles.productTitle}>{product.title}</h3>
              <p className={styles.description}>{product.description}</p>
              <div className={styles.priceContainer}>
                <span className={styles.price}>${product.price.toFixed(2)}</span>
                {product.discount && (
                  <span className={styles.originalPrice}>
                    ${(product.price / (1 - product.discount / 100)).toFixed(2)}
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