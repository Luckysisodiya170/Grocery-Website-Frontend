import React, { createContext, useState, useEffect, useContext } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ✅ CALCULATED VALUES
  const subtotal = cart.reduce(
    (total, item) => total + Number(item.price) * Number(item.quantity),
    0
  );

  const shippingCharge = subtotal > 500 || subtotal === 0 ? 0 : 40;
  const grandTotal = subtotal + shippingCharge;

  // ✅ CORRECTED: Add item with dynamic quantity
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      
      // Get the quantity passed from the product page, default to 1 if not provided
      const qtyToAdd = product.quantity || 1; 

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + qtyToAdd }
            : item
        );
      }

      return [...prevCart, { ...product, quantity: qtyToAdd }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const item = prevCart.find((i) => i.id === productId);

      if (item && item.quantity > 1) {
        return prevCart.map((i) =>
          i.id === productId ? { ...i, quantity: i.quantity - 1 } : i
        );
      }
      return prevCart.filter((i) => i.id !== productId);
    });
  };

  const clearItemFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  const getCartCount = () =>
    cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        subtotal,
        shippingCharge,
        grandTotal,
        addToCart,
        removeFromCart,
        clearItemFromCart,
        clearCart,
        getCartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};