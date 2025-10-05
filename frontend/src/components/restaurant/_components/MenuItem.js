import React from "react";

export default function MenuItem() {
  const menu = [];
  return (
    <div className="bg-surface p-6 rounded-2xl border border-border shadow-md">
      <h2 className="text-xl font-semibold mb-4">Menu</h2>
      {menu.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-text-muted py-10">
          <p>No items available yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {menu.map((item, idx) => (
            <div
              key={idx}
              className="p-4 bg-white rounded-xl border border-border shadow hover:shadow-lg transition"
            >
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-text-secondary text-sm">{item.description}</p>
              <p className="mt-2 text-primary font-bold">₹{item.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
