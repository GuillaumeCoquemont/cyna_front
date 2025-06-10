// src/components/checkout/CartSummary.jsx
import React from 'react';
import { useCart } from '../../context/CartContext';
import styles from '../../styles/components/checkout/CartSummary.module.css';

export default function CartSummary({ items }) {
  const { updateQty, removeFromCart } = useCart();

  return (
    <div className={styles.cartSummary}>
      <div className={styles.headerRow}>
        <span></span>
        <span>Produit</span>
        <span>Prix</span>
        <span>Qté</span>
        <span>Total</span>
        <span></span>
      </div>
      <ul>
        {items.map((item, index) => {
          const unitPrice = parseFloat(String(item.price).replace(',', '.')) || 0;
          const lineTotal = (unitPrice * item.quantity).toFixed(2);
          return (
            <li key={`${item.id}-${index}`} className={styles.item}>
              {/* Structure pour desktop */}
              <img loading="lazy" src={item.image} alt={item.name} className={styles.thumb} />
              <span className={styles.name}>{item.name}</span>
              <span className={styles.unit}>{item.price}€</span>
              <div className={styles.qtyControls}>
                <button
                  onClick={() => updateQty(item.id, Math.max(1, item.quantity - 1))}
                  disabled={item.quantity <= 1}
                >−</button>
                <span className={styles.qtyValue}>{item.quantity}</span>
                <button onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
              </div>
              <span className={styles.total}>{lineTotal}€</span>
              <button
                className={styles.removeBtn}
                onClick={() => removeFromCart(item.id)}
                aria-label="Supprimer"
              >×</button>

              {/* Structure supplémentaire pour mobile (invisible sur desktop) */}
              <div className={styles.itemHeader}>
                <img loading="lazy" src={item.image} alt={item.name} className={styles.thumb} />
                <span className={styles.name}>{item.name}</span>
              </div>
              
              <div className={styles.itemFooter}>
                <div className={styles.priceInfo}>
                  <span className={styles.unit}>{item.price}€</span>
                  <span className={styles.total}>{lineTotal}€</span>
                </div>
                <div className={styles.qtyControls}>
                  <button
                    onClick={() => updateQty(item.id, Math.max(1, item.quantity - 1))}
                    disabled={item.quantity <= 1}
                  >−</button>
                  <span className={styles.qtyValue}>{item.quantity}</span>
                  <button onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}