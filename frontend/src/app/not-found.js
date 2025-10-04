"use client";
import React from "react";
import { Coffee, Pizza, IceCream, Home } from "lucide-react";
import { useRouter } from "next/navigation";

const NotFound = () => {
  const router = useRouter();
  return (
    <div className="w-full min-h-[60vh] flex flex-col justify-center items-center bg-background font-sans">
      <div className="flex space-x-6 mb-6">
        <Coffee className="w-16 h-16 text-yellow-500 animate-bounce" />
        <Pizza className="w-16 h-16 text-red-500 animate-spin" />
        <IceCream className="w-16 h-16 text-pink-400 animate-bounce delay-150" />
      </div>
      <h1 className="text-5xl font-bold text-[var(--color-foreground)] mb-4">
        404
      </h1>
      <p className="text-lg text-center text-[var(--color-foreground)] mb-6 max-w-sm">
        Oops! Looks like your cravings led to a page that doesn’t exist. 🍔🍦☕
      </p>
      <button
        onClick={() => router.push("/")}
        className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition"
      >
        <Home className="w-5 h-5" />
        <span>Back to Menu</span>
      </button>
    </div>
  );
};

export default NotFound;
