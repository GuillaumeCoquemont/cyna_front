import React from 'react';
import {
  FaStar,
  FaMinus,
  FaPlus,
  FaShoppingCart,
  FaCreditCard
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/components/productDetails/ProductInfo.module.css';
import { calculateDiscountedPrice, formatPrice } from '../../utils/priceUtils';

const ProductInfo = ({ product, quantity, setQuantity, addToCart }) => {
  const navigate = useNavigate();
  const discountedPrice = calculateDiscountedPrice(product.price, product.promoCode);

  return (
    <div className={styles.info}>
      <h1 className={styles.title}>{product.name}</h1>
      <div className={styles.priceRating}>
        {product.promoCode ? (
          <div className={styles.priceContainer}>
            <span className={styles.originalPrice}>{formatPrice(product.price)}</span>
            <span className={styles.price}>{formatPrice(discountedPrice)}</span>
          </div>
        ) : (
          <span className={styles.price}>{formatPrice(product.price)}</span>
        )}
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
        <button
          className={styles.addToCart}
          onClick={() => {
            addToCart(product, quantity);
          }}
        >
          <FaShoppingCart /> Ajouter au panier
        </button>
        <button
          className={styles.buyNow}
          onClick={() => {
            addToCart(product, quantity);
            navigate('/checkout');
          }}
        >
          <FaCreditCard /> Acheter maintenant
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;