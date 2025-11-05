"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

const CartContext = createContext();

export default function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [openCart, setOpenCart] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
    try {
      const stored = localStorage.getItem("ponion_cart");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setCart(parsed);
        else throw new Error("Invalid cart structure");
      }
    } catch (err) {
      console.error("Cart data corrupted, resetting:", err);
      localStorage.removeItem("ponion_cart");
      setCart([]);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem("ponion_cart", JSON.stringify(cart));
    } catch (err) {
      toast.error("Failed to save cart:", err);
    }
  }, [cart]);

  const addCart = (item) => {
    if (!item || !item._id) return;
    item.quantity = 1;
    setCart((prev) => {
      const exists = prev.some((i) => i._id === item._id);
      if (exists) return prev;
      return [...prev, item];
    });
    toast("Added to cart.");
  };

  const removeCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
    toast("Item Removed!");
  };

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item._id === id) {
            if ((item.quantity || 1) <= 1) {
              toast.info("Item removed from cart");
              return null;
            }
            return { ...item, quantity: (item.quantity || 1) - 1 };
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const increaseQty = (id) => {
    const updated = cart.map((item) =>
      item._id === id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
    );

    setCart(updated);
  };

  const total = cart.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addCart,
        removeCart,
        openCart,
        setOpenCart,
        decreaseQty,
        increaseQty,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
