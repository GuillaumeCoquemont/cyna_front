
import React from 'react';
import {
  FaStar,
  FaMinus,
  FaPlus,
  FaShoppingCart,
  FaCreditCard
} from 'react-icons/fa';
import styles from '../../styles/components/productDetails/ProductInfo.module.css';

const ProductInfo = ({ product, quantity, setQuantity }) => {
  return (
    <div className={styles.info}>
      <h1 className={styles.title}>{product.name}</h1>
      <div className={styles.priceRating}>
        <span className={styles.price}>{product.price}</span>
        <div className={styles.rating}>
          <FaStar /> <span>{product.rating}</span> ({product.reviews} avis)
        </div>
      </div>

      <p className={styles.shortDescription}>{product.shortDescription}</p>
      <p className={styles.longDescription}>{product.longDescription}</p>

      <ul className={styles.features}>
        {product.features.map((feat, idx) => (
          <li key={idx}>{feat}</li>
        ))}
      </ul>

      <div className={styles.actions}>
        <div className={styles.quantity}>
          <button
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            aria-label="Réduire la quantité"
          >
            <FaMinus />
          </button>
          <span className={styles.qtyValue}>{quantity}</span>
          <button
            onClick={() => setQuantity(q => q + 1)}
            aria-label="Augmenter la quantité"
          >
            <FaPlus />
          </button>
        </div>
        <button className={styles.addToCart}>
          <FaShoppingCart /> Ajouter au panier
        </button>
        <button className={styles.buyNow}>
          <FaCreditCard /> Acheter maintenant
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;