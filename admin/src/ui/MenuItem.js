"use client";
import React from "react";
import { Leaf, Egg, Drumstick, ShoppingCart } from "lucide-react";

export default function UserMenu({ items = [], onAddToCart }) {
  return (
    <div className="w-full bg-background min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-semibold text-foreground mb-6">Menu</h2>

        {items.length === 0 ? (
          <div className="text-center text-text-muted py-16 italic">
            No menu items available.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <MenuCard key={item._id} item={item} onAddToCart={onAddToCart} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MenuCard({ item, onAddToCart }) {
  const dietIcon =
    item.dietType === "veg" ? (
      <Leaf size={16} className="text-green-600" />
    ) : item.dietType === "egg" ? (
      <Egg size={16} className="text-yellow-600" />
    ) : (
      <Drumstick size={16} className="text-red-600" />
    );

  return (
    <div className="bg-surface border border-border rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
      <div className="relative w-full h-40 overflow-hidden">
        <img
          src={item.thumbnail?.replace("\\", "/")}
          alt={item.itemName}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
        />
        {!item.available && (
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
            disabled={!item.available}
            onClick={() => onAddToCart && onAddToCart(item)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition
              ${
                item.available
                  ? "bg-primary hover:bg-primary-hover text-white"
                  : "bg-accent-surface text-text-muted cursor-not-allowed"
              }`}
          >
            <ShoppingCart size={16} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
