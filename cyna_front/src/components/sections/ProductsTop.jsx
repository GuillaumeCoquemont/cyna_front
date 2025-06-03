import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/components/sections/ProductsTop.module.css';
import { fetchProducts } from '../../api/products';
import { fetchServices } from '../../api/services';

const ProductsTop = () => {
  const [topItems, setTopItems] = useState([]);

  useEffect(() => {
    Promise.all([fetchProducts(), fetchServices()])
      .then(([products, services]) => {
        // Filtrer produits/services avec promoCode
        const prodsWithPromo = products.filter(p => p.promoCode);
        const servsWithPromo = services.filter(s => s.promoCode);
        // On peut ajouter un champ type pour différencier à l'affichage
        const allWithPromo = [
          ...prodsWithPromo.map(p => ({ ...p, type: 'product' })),
          ...servsWithPromo.map(s => ({ ...s, type: 'service' }))
        ];
        setTopItems(allWithPromo);
      })
      .catch(err => console.error('Erreur chargement produits/services:', err));
  }, []);

  return (
    <section className={styles.topSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.title}>Les tops promos du moment</h2>
      </div>

      <div className={styles.productsGrid}>
        {topItems.map((item) => (
          <Link
            key={item.type + '-' + item.id}
            to={item.type === 'product' ? `/product/${item.id}` : `/service/${item.id}`}
            className={styles.productLink}
          >
            <div className={styles.productCard}>
              <div className={styles.productImage}>
                <img src={item.image} alt={item.name} className={styles.productImageTag} />
                <span className={styles.label + ' ' + styles.labelPromo}>
                  {item.promoCode.discountType === 'percentage'
                    ? `-${item.promoCode.discountValue}%`
                    : `-${item.promoCode.discountValue}€`}
                </span>
              </div>
              <div className={styles.productInfo}>
                <h3 className={styles.productTitle}>{item.name}</h3>
                <p className={styles.productDesc}>{item.description}</p>
                <p className={styles.price}>
                  {Number(item.price).toFixed(2)} €
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
