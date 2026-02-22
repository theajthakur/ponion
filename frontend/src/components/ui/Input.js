"use client";
import React from "react";

export default function Input({
  label,
  placeholder,
  value,
  onChange,
  icon: Icon,
  error,
  type = "text",
  ...props
}) {
  return (
    <div className="flex flex-col w-full">
      {label && (
        <label className="text-sm font-semibold text-foreground mb-1">
          {label}
        </label>
      )}

      <div className="relative w-full">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          {...props}
          className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary
            ${Icon ? "pl-10" : ""} 
            ${error ? "border-red-500" : "border-border"} 
            bg-surface text-foreground placeholder:text-muted`}
        />
      </div>

      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
}
