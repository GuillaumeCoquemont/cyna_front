import React from 'react';
import { useCart } from '../context/CartContext';
import CartSummary     from '../components/checkout/CartSummary';
import ShippingForm    from '../components/checkout/ShippingForm';
import PaymentSummary  from '../components/checkout/PaymentSummary';
import styles          from '../styles/pages/CheckoutPage.module.css';

export default function CheckoutPage() {
  const { cart, totalItems } = useCart();

  return (
    <div className={styles.container}>
      <h1>Finaliser ma commande</h1>
      <div className={styles.layout}>
        <section className={styles.left}>
          <CartSummary items={cart} />
          <ShippingForm />
        </section>
        <aside className={styles.right}>
          <PaymentSummary items={cart} totalItems={totalItems} />
        </aside>
      </div>
    </div>
  );
}