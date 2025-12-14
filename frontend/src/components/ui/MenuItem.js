"use client";
import React, { memo, useMemo } from "react";
import { Leaf, Egg, Drumstick, ShoppingCart } from "lucide-react";
import { useCart } from "../providers/CartProvider";

export default function UserMenu({ items = [] }) {
  const { addCart, cart, removeCart, openCart } = useCart();

  if (!items.length) {
    return (
      <div className="w-full py-20 text-center text-muted-foreground italic">
        No menu items available.
      </div>
    );
  }

  return (
    <section className="w-full py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Menu</h2>
        <div
          className={`grid grid-cols-1 gap-6 ${
            openCart ? "lg:grid-cols-2" : "lg:grid-cols-3"
          }`}
        >
          {items.map((item) => (
            <MemoizedMenuCard
              key={item._id}
              item={item}
              inCart={cart.some((c) => c._id === item._id)}
              addCart={addCart}
              removeCart={removeCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const MenuCard = ({ item, inCart, addCart, removeCart }) => {
  const dietIcon = useMemo(() => {
    switch (item.dietType) {
      case "veg":
        return <Leaf size={14} className="text-green-600" />;
      case "egg":
        return <Egg size={14} className="text-yellow-600" />;
      default:
        return <Drumstick size={14} className="text-red-600" />;
    }
  }, [item.dietType]);

  const handleClick = () => (inCart ? removeCart(item._id) : addCart(item));

  const isAvailable = item.available !== false;

  return (
    <article className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border hover:-translate-y-1 flex flex-col h-full">
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={item.thumbnail}
          alt={item.itemName}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center text-white font-bold text-lg">
            Unavailable
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md p-1.5 rounded-full shadow-sm">
          {dietIcon}
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {item.itemName}
          </h3>
        </div>

        <p className="text-text-secondary text-sm mb-4 line-clamp-2 leading-relaxed">
          {item.description ||
            `Delicious and freshly prepared ${item.itemName}.`}
        </p>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/50">
          <span className="text-xl font-black text-foreground">
            ₹{item.price}
          </span>
          <button
            onClick={handleClick}
            disabled={!isAvailable}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 shadow-sm ${
              inCart
                ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                : isAvailable
                ? "bg-primary text-white hover:bg-primary-hover hover:shadow-primary/30 hover:scale-105"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {!inCart && <ShoppingCart size={16} strokeWidth={2.5} />}
            {inCart ? "Remove" : "Add"}
          </button>
        </div>
      </div>
    </article>
  );
};

const MemoizedMenuCard = memo(MenuCard);
