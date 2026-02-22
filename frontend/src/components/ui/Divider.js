import React from "react";

export default function Divider({ label }) {
  return (
    <div className="flex items-center my-6">
      <div className="flex-grow border-t border-border"></div>
      {label && (
        <span className="px-4 text-sm font-medium text-muted">
          {label}
        </span>
      )}
      <div className="flex-grow border-t border-border"></div>
    </div>
  );
}
