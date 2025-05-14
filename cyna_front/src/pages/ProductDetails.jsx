// src/pages/ProductDetails.jsx
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import ProductGallery from '../components/productDetails/ProductGallery';
import ProductInfo    from '../components/productDetails/ProductInfo';
import ProductTabs    from '../components/productDetails/ProductTabs';
import styles from '../styles/pages/ProductDetails.module.css';

// Import product images
import prod1 from '../assets/images/prod1.jpg';
import prod2 from '../assets/images/prod2.jpg';
import prod3 from '../assets/images/prod3.jpg';

const ProductDetails = () => {
  const { addToCart } = useCart();
  const sampleProduct = {
    name: 'Nom du produit',
    price: '54,98€',
    rating: 4.5,
    reviews: 2,
    shortDescription: 'Courte description du produit ici.',
    features: ['Lorem ipsum dolor sit amet, consectetuer adipi ', 'Lorem ipsum dolor sit amet, consectetuer adipi scing elit', 'Lorem ipsum dolor sit amet, consectetuer adipi scing elit, '],
    longDescription: `Lorem ipsum dolor sit amet, consectetuer adipi scing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magn. Lorem ipsum dolor sit amet, consectetuer adipi scing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magn.`,
    reviewsList: [
      { author: 'Alice', comment: 'Super produit!' },
      { author: 'Bob',   comment: 'Très bon rapport qualité/prix.' }
    ]
  };

  const [quantity, setQuantity] = useState(1);
  const galleryImages = [
    prod1,
    prod2,
    prod3
  ];

  return (
    <div className={styles.container}>
      <section className={styles.topSection}>
        <ProductGallery images={galleryImages} />
        <ProductInfo
          product={sampleProduct}
          quantity={quantity}
          setQuantity={setQuantity}
          addToCart={addToCart}
        />
      </section>
      <section className={styles.tabsSection}>
        <ProductTabs product={sampleProduct} />
      </section>

    </div>
  );
};

export default ProductDetails;