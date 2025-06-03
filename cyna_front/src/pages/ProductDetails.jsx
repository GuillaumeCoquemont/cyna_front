// src/pages/ProductDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductById, fetchServiceById } from '../api/productDetails';
import { useCart } from '../context/CartContext';
import ProductGallery from '../components/productDetails/ProductGallery';
import ProductInfo from '../components/productDetails/ProductInfo';
import ProductTabs from '../components/productDetails/ProductTabs';
import styles from '../styles/pages/ProductDetails.module.css';

// Import product images
import prod1 from '../assets/images/prod1.jpg';
import prod2 from '../assets/images/prod2.jpg';
import prod3 from '../assets/images/prod3.jpg';

const ProductDetails = () => {
  const { id, type } = useParams(); // type = 'product' ou 'service'
  const { addToCart } = useCart();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        let data;
        if (type === 'service') {
          data = await fetchServiceById(id);
        } else {
          data = await fetchProductById(id);
        }
        setItem(data);
      } catch (err) {
        setItem(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, type]);

  if (loading) return <div>Chargement…</div>;
  if (!item) return <div>Produit ou service introuvable.</div>;

  return (
    <div className={styles.container}>
      <section className={styles.topSection}>
        <ProductGallery images={item.images || [item.image]} />
        <ProductInfo
          product={item}
          quantity={quantity}
          setQuantity={setQuantity}
          addToCart={addToCart}
        />
      </section>
      <section className={styles.tabsSection}>
        <ProductTabs product={item} />
      </section>
    </div>
  );
};

export default ProductDetails;