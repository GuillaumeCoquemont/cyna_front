// src/components/produitDetails/ProductGallery.jsx
import React, { useState } from 'react';
import styles from '../../styles/components/productDetails/ProductGallery.module.css';

const ProductGallery = ({ images }) => {
  const [selected, setSelected] = useState(0);
  return (
    <div className={styles.gallery}>
      <div className={styles.thumbnails}>
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Thumbnail ${i + 1}`}
            className={`${styles.thumbnail} ${i === selected ? styles.active : ''}`}
            onClick={() => setSelected(i)}
          />
        ))}
      </div>
      <div className={styles.mainImage}>
        <img src={images[selected]} alt="Selected product" />
      </div>
    </div>
  );
};

export default ProductGallery;