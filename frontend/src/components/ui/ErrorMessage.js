"use client";
import React from "react";
import { AlertTriangle, Info, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function StatusMessage({
  type = "error",
  message = "Something went wrong!",
}) {
  const router = useRouter();
  const iconMap = {
    error: <XCircle className="w-16 h-16 text-primary drop-shadow-md" />,
    info: <Info className="w-16 h-16 text-info drop-shadow-md" />,
    warning: (
      <AlertTriangle className="w-16 h-16 text-secondary drop-shadow-md" />
    ),
  };

  const bgMap = {
    error: "bg-surface",
    info: "bg-surface",
    warning: "bg-surface",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-border shadow-sm ${bgMap[type]}`}
    >
      <div className="flex justify-center items-center mb-4 animate-bounce-slow">
        {iconMap[type]}
      </div>
      <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
        {type === "error"
          ? "Oops! Something went wrong"
          : type === "info"
          ? "Heads up!"
          : "Warning"}
      </h2>
      <p className="text-text-secondary text-sm sm:text-base max-w-md">
        {message}
      </p>
      <div className="flex justify-center w-full">
        <button
          className="px-3 py-2 bg-primary hover:bg-primary-hover cursor-pointer rounded-sm mt-4"
          onClick={() => {
            router.push("/");
          }}
        >
          Go Back to Home
        </button>
      </div>
    </div>
  );
}
