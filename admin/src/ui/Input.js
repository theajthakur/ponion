import React from "react";

export default function Input({
  value,
  name,
  type,
  onChange,
  className,
  placeholder,
}) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full p-2.5 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none ${className}`}
    />
  );
}
