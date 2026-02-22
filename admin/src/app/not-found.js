"use client";
import React from "react";
import { AlertCircle, Coffee, Home } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RestaurantNotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] bg-surface px-4 text-center relative overflow-hidden">
      <Coffee className="absolute top-10 left-10 w-16 h-16 text-secondary opacity-20 animate-bounce-slow" />
      <Coffee className="absolute bottom-10 right-10 w-20 h-20 text-primary opacity-15 animate-bounce-slow" />
      <AlertCircle className="w-20 h-20 text-warning mb-4" />
      <h1 className="text-6xl font-extrabold text-foreground mb-2">404</h1>
      <p className="text-secondary text-lg mb-6 max-w-md">
        The page you are looking for does not exists. <br />
        Maybe it moved or never existed.
      </p>
      <button
        onClick={() => router.push("/")}
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-card font-semibold rounded-lg hover:bg-secondary transition"
      >
        <Home className="w-5 h-5" />
        Back to Dashboard
      </button>
    </div>
  );
}
