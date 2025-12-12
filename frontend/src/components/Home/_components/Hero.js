"use client";

import { motion } from "framer-motion";
import React from "react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-surface">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block py-1 px-3 rounded-full bg-accent-surface text-primary font-bold text-sm mb-6 border border-primary/20">
                🚀 Fastest Delivery in Town
              </span>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-foreground leading-tight mb-6 tracking-tight">
                Craving <span className="text-primary">Delicious</span> Food?
              </h1>
              <p className="text-xl text-text-secondary mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Order from the best local restaurants and get fresh food
                delivered to your doorstep in minutes.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button className="px-8 py-4 rounded-full bg-primary text-white font-bold text-lg shadow-lg shadow-primary/30 hover:bg-primary-hover hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                  Order Now <span className="text-xl">🍕</span>
                </button>
                <button className="px-8 py-4 rounded-full bg-white text-foreground font-bold text-lg border-2 border-border hover:border-primary hover:text-primary transition-all duration-300 flex items-center justify-center gap-2">
                  View Menu
                </button>
              </div>

              <div className="mt-12 flex items-center justify-center lg:justify-start gap-8">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden"
                    >
                      <img
                        src={`https://i.pravatar.cc/100?img=${i + 10}`}
                        alt="User"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1 text-yellow-400">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg
                        key={i}
                        className="w-4 h-4 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm font-bold text-foreground">
                    5000+ Happy Customers
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="w-full lg:w-1/2 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative z-10"
            >
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80"
                alt="Delicious Food"
                className="w-full max-w-lg mx-auto rounded-3xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500"
              />
            </motion.div>

            {/* Decorative elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-full blur-3xl -z-10 opacity-60"></div>
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 bg-white p-4 rounded-2xl shadow-xl z-20 hidden lg:block"
            >
              <span className="text-4xl">🍔</span>
            </motion.div>
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-10 -left-10 bg-white p-4 rounded-2xl shadow-xl z-20 hidden lg:block"
            >
              <span className="text-4xl">🥗</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
