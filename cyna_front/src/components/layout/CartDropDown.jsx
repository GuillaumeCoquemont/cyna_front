import React from 'react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import styles from '../../styles/components/cartDropDown/CartDropDown.module.css';
import { FaCreditCard } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


const CartDropdown = () => {
  const { cart, totalItems, updateQty, removeFromCart } = useCart();
  const navigate = useNavigate();

  // Calcule le total : on retire tout ce qui n'est pas chiffre dans la chaîne et on multiplie
  const totalPrice = cart
    .reduce((sum, item) => {
      const priceNum = parseFloat(String(item.price).replace(/[^0-9.,-]/g, '').replace(',', '.')) || 0;
      return sum + priceNum * item.quantity;
    }, 0)
    .toFixed(2);

  if (cart.length === 0) {
    return <div className={styles.empty}>Votre panier est vide.</div>;
  }

  return (
    <div className={styles.dropdown}>
      <ul className={styles.itemsList}>
        {cart.map(item => (
          <li key={item.id} className={styles.item}>
            <img src={item.image} alt={item.name} className={styles.thumbnail} />
            <span className={styles.name}>{item.name}</span>
            <div className={styles.qtyControls}>
              <button
                className={styles.qtyBtn}
                onClick={() => updateQty(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                −
              </button>
              <span className={styles.qtyValue}>{item.quantity}</span>
              <button
                className={styles.qtyBtn}
                onClick={() => updateQty(item.id, item.quantity + 1)}
              >
                +
              </button>
            </div>
            <span className={styles.price}>{item.price}</span>
            <button
              className={styles.removeBtn}
              onClick={() => removeFromCart(item.id)}
              aria-label="Retirer"
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      <div className={styles.footer}>
        <span className={styles.totalLabel}>
          Total ({totalItems} article{totalItems > 1 ? 's' : ''}) :
        </span>
        <span className={styles.totalPrice}>{totalPrice}€</span>
      </div>

      <Link to="/cart" className={styles.viewCart}>
        Voir le panier complet
      </Link>
      <button
        className={styles.buyNow}
        onClick={() => navigate('/checkout')}
      >
        <FaCreditCard /> Procéder au paiement
      </button>
    </div>
  );
};

export default CartDropdown;