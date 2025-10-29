"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

const CartContext = createContext();

export default function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
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

  return (
    <CartContext.Provider value={{ cart, setCart, addCart, removeCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
