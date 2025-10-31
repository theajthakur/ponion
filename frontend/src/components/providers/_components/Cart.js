"use client";
import React from "react";
import { useCart } from "../CartProvider";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";

export default function CartSide() {
  const { openCart, cart, removeCart, decreaseQty, increaseQty } = useCart();
  if (!openCart) return "";
  const total = cart.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );
  return (
    <div className="relative">
      <div className="cart-container w-full md:w-sm fixed md:sticky top-0 left-0 h-screen bg-white shadow-2xl p-3 z-50">
        <h2 className="text-4xl flex items-center gap-2 justify-center w-full">
          <ShoppingCart /> Cart
        </h2>

        <div className="cart-container max-w-3xl mx-auto p-4 space-y-3 h-full overflow-y-scroll">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
              <ShoppingCart size={42} className="mb-3 opacity-70" />
              <p className="text-lg font-medium">Your cart is empty</p>
              <p className="text-sm text-gray-400">
                Add some items to make your stomach happy 🍔
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <div className="overflow-hidden rounded-xl">
                    <img
                      src={`${
                        process.env.NEXT_PUBLIC_SERVER_URL
                      }${item.thumbnail.replace(/\\/g, "/")}`}
                      alt={item.itemName}
                      className="min-w-20 h-20 object-cover hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>

                  <div className="flex flex-col">
                    <h2 className="text-base font-semibold text-gray-800 leading-tight">
                      {item.itemName}
                    </h2>
                    <p
                      className={`text-xs mt-1 flex items-center gap-1 ${
                        item.dietType === "veg"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          item.dietType === "veg"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      ></span>
                      {item.dietType === "veg"
                        ? "Vegetarian"
                        : "Non-Vegetarian"}
                    </p>
                    <span className="text-lg font-medium text-gray-900 mt-2">
                      ₹{item.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decreaseQty(item._id)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="text-base font-medium text-gray-700 min-w-[20px] text-center">
                      {item.quantity || 1}
                    </span>
                    <button
                      onClick={() => increaseQty(item._id)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeCart(item._id)}
                    className="text-xs flex items-center gap-1 text-red-500 hover:text-red-600 font-medium"
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>
            ))
          )}

          {cart.length > 0 && (
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 my-4 rounded-xl shadow-md flex justify-between items-center">
              <div>
                <h3 className="text-gray-700 text-sm">Total</h3>
                <p className="text-lg font-semibold text-gray-900">
                  ₹{total.toLocaleString()}
                </p>
              </div>
              <button className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-5 py-2.5 rounded-full shadow-sm flex items-center gap-2">
                <ShoppingCart size={16} />
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
