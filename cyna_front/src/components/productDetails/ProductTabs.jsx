// src/components/produitDetails/ProductTabs.jsx
import React, { useState } from 'react';
import styles from '../../styles/components/productDetails/ProductTabs.module.css';

const ProductTabs = ({ product }) => {
  const [activeTab, setActiveTab] = useState('desc');

  return (
    <div className={styles.tabs}>
      <div className={styles.headers}>
        <button
          className={activeTab === 'desc' ? styles.active : ''}
          onClick={() => setActiveTab('desc')}
        >
          Description
        </button>
        <button
          className={activeTab === 'reviews' ? styles.active : ''}
          onClick={() => setActiveTab('reviews')}
        >
          Avis ({product.reviews})
        </button>
      </div>
      <div className={styles.content}>
        {activeTab === 'desc' && (
          <p>{product.longDescription}</p>
        )}
        {activeTab === 'reviews' && (
          <ul className={styles.reviewList}>
            {product.reviewsList.map((rev, idx) => (
              <li key={idx}>
                <strong>{rev.author}</strong>: {rev.comment}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;