import React from "react";

export default function Button({
  children,
  className,
  type = "submit",
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`w-full py-2.5 flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white rounded-md transition-all ${className}`}
    >
      {children}
    </button>
  );
}
