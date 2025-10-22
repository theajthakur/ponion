"use client";
import React from "react";
import { Edit, Trash2, CheckCircle, XCircle } from "lucide-react";

export default function MenuList({ data = [], onEdit, onDelete, className }) {
  return (
    <div
      className={`bg-surface border border-border rounded-2xl shadow-sm p-6 overflow-x-auto ${className}`}
    >
      <h2 className="text-xl font-semibold text-foreground mb-4">Menu Items</h2>
      <div className=" max-h-[80vh] overflow-scroll">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-accent-surface text-text-secondary">
            <tr>
              <th className="p-3 border-b border-border font-medium">Image</th>
              <th className="p-3 border-b border-border font-medium">
                Item Name
              </th>
              <th className="p-3 border-b border-border font-medium">Price</th>
              <th className="p-3 border-b border-border font-medium">
                Diet Type
              </th>
              <th className="p-3 border-b border-border font-medium">
                Available
              </th>
              <th className="p-3 border-b border-border font-medium text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="p-4 text-center text-text-muted italic"
                >
                  No menu items found
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item._id || item.id}
                  className="hover:bg-accent-surface transition-colors"
                >
                  <td className="p-3 border-b border-border">
                    <img
                      src={
                        process.env.NEXT_PUBLIC_SERVER_URL + item.thumbnail ||
                        "/placeholder.jpg"
                      }
                      alt={item.itemName}
                      className="w-12 h-12 rounded-md object-cover border border-border"
                    />
                  </td>
                  <td className="p-3 border-b border-border text-foreground font-medium">
                    {item.itemName}
                  </td>
                  <td className="p-3 border-b border-border text-text-secondary">
                    ₹{item.price}
                  </td>
                  <td className="p-3 border-b border-border">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-medium capitalize ${
                        item.dietType === "veg"
                          ? "bg-green-100 text-green-700"
                          : item.dietType === "egg"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.dietType.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-3 border-b border-border">
                    {item.available ? (
                      <span className="flex items-center gap-1 text-success">
                        <CheckCircle size={16} />
                        <span className="text-sm">Yes</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-error">
                        <XCircle size={16} />
                        <span className="text-sm">No</span>
                      </span>
                    )}
                  </td>
                  <td className="p-3 border-b border-border text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onEdit && onEdit(item)}
                        className="p-2 rounded-md hover:bg-accent-surface text-primary transition"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => onDelete && onDelete(item)}
                        className="p-2 rounded-md hover:bg-accent-surface text-error transition"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
