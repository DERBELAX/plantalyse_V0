import React, { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      const existing = state.find(item => item.id === action.payload.id);
      return existing
        ? state.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...state, { ...action.payload, quantity: 1 }];

    case "UPDATE_QUANTITY":
      return state.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(1, item.quantity + action.payload.delta) }
          : item
      );

    case "REMOVE_FROM_CART":
      return state.filter(item => item.id !== action.payload);

    case "CLEAR_CART":
      return [];

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, [], () => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
