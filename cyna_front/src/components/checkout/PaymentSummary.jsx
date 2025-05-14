import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import styles from '../../styles/components/checkout/PaymentSummary.module.css';

export default function PaymentSummary({ items, totalItems }) {
  const [hovering, setHovering] = useState(false);
  const { clearCart } = useCart();

  const subtotal = items
    .reduce((sum, i) => {
      const raw = i.price != null ? i.price.toString() : '';
      const priceNum = parseFloat(raw.replace(',', '.')) || 0;
      return sum + priceNum * i.quantity;
    }, 0)
    .toFixed(2);

  const discount = 0; // ou logique si promo
  const total = (subtotal - discount).toFixed(2);

  const handleCheckout = () => {
    // ici tu appelleras ton API ou Stripe, etc.
    alert(`Payer ${total}€`);
    clearCart();
  };

  return (
    <div className={`${styles.summary} ${hovering ? styles.dimmed : ''}`}>
      <h2>Résumé de la commande</h2>
      <div className={styles.row}>
        <span>Sous-total ({totalItems} article{totalItems>1?'s':''}) :</span>
        <span>{subtotal}€</span>
      </div>
      <div className={styles.row}>
        <span>Remise :</span>
        <span>{discount>0? `${discount}€` : '–'}</span>
      </div>
      <div className={styles.row + ' ' + styles.total}>
        <span>Total :</span>
        <span>{total}€</span>
      </div>
      <button
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onClick={handleCheckout}
        className={styles.payButton}
      >
        Procéder au paiement
      </button>
    </div>
  );
}