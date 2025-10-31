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
        return <Leaf size={16} className="text-green-600" />;
      case "egg":
        return <Egg size={16} className="text-yellow-600" />;
      default:
        return <Drumstick size={16} className="text-red-600" />;
    }
  }, [item.dietType]);

  const handleClick = () => (inCart ? removeCart(item._id) : addCart(item));

  const isAvailable = item.available !== false;
  const imageUrl = `${
    process.env.NEXT_PUBLIC_SERVER_URL
  }${item.thumbnail?.replace(/\\/g, "/")}`;

  return (
    <article className="bg-surface border border-border rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
      <div className="relative w-full h-40 overflow-hidden">
        <img
          src={imageUrl}
          alt={item.itemName}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-semibold text-sm">
            Unavailable
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium text-foreground truncate">
            {item.itemName}
          </h3>
          {dietIcon}
        </div>

        <p className="text-text-secondary text-sm mb-3 line-clamp-2">
          Delicious and freshly prepared {item.itemName}.
        </p>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-primary font-semibold text-lg">
            ₹{item.price}
          </span>
          <button
            onClick={handleClick}
            disabled={!isAvailable}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition ${
              inCart
                ? "text-primary border-2 border-primary hover:bg-primary hover:text-white"
                : isAvailable
                ? "bg-primary hover:bg-primary-hover text-white"
                : "bg-accent-surface text-text-muted cursor-not-allowed"
            }`}
          >
            {!inCart && <ShoppingCart size={16} />}
            {inCart ? "Remove" : "Add"}
          </button>
        </div>
      </div>
    </article>
  );
};

const MemoizedMenuCard = memo(MenuCard);
