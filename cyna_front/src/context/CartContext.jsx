import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const initialState = JSON.parse(localStorage.getItem('cart')) || [];

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      // si déjà présent, augmente la qty, sinon ajoute
      const exists = state.find(i => i.id === action.item.id);
      if (exists) {
        return state.map(i =>
          i.id === action.item.id
            ? { ...i, quantity: i.quantity + action.item.quantity }
            : i
        );
      }
      return [...state, action.item];

    case 'UPDATE':
      return state.map(i =>
        i.id === action.id ? { ...i, quantity: action.quantity } : i
      );

    case 'REMOVE':
      return state.filter(i => i.id !== action.id);

    case 'CLEAR':
      return [];

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  // persister dans localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) =>
    dispatch({ type: 'ADD', item: { ...product, quantity } });

  const updateQty = (id, quantity) =>
    dispatch({ type: 'UPDATE', id, quantity });

  const removeFromCart = id => dispatch({ type: 'REMOVE', id });

  const clearCart = () => dispatch({ type: 'CLEAR' });

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQty, removeFromCart, clearCart, totalItems }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Hook pour consommer facilement
export const useCart = () => useContext(CartContext);