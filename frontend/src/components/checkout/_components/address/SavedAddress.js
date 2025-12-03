"use client";

import React, { useState } from "react";
import { MapPin, Home, Building2, Plus } from "lucide-react";
import CheckoutConfirmation from "./CheckoutConfirmation";

export default function SavedAddresses({
  addresses = [],
  onAdd,
  setSetMode,
  orderAddress,
  setOrderAddress,
}) {
  const hasAddresses = addresses && addresses.length > 0;

  if (!hasAddresses) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-surface rounded-2xl border border-border shadow-sm text-center">
        <MapPin size={48} className="text-primary mb-3" />
        <h3 className="text-xl font-semibold text-foreground mb-1">
          No Addresses Found
        </h3>
        <p className="text-secondary mb-4">
          You haven't added any address yet. Add one to make delivery easier!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orderAddress ? (
        <CheckoutConfirmation address={orderAddress} onChange={() => setOrderAddress(null)} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-transparent hover:border-primary/50 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${addr.Label?.toLowerCase().includes("office")
                      ? "bg-blue-50 text-blue-600"
                      : "bg-orange-50 text-orange-600"
                    }`}>
                    {addr.Label?.toLowerCase().includes("office") ? (
                      <Building2 size={20} />
                    ) : (
                      <Home size={20} />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">{addr.Label || "Address"}</h3>
                    <p className="text-sm text-text-muted font-medium">{addr.Name}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-1 mb-6 text-text-secondary text-sm leading-relaxed">
                <p>{addr.Flat}, {addr.Area}</p>
                <p>{addr.Landmark}</p>
                <p>{addr.District}, {addr.State} - <span className="font-semibold text-foreground">{addr.PinCode}</span></p>
                <p className="pt-2 flex items-center gap-2 text-text-muted">
                  <span>📞</span> {addr.Mobile}
                </p>
              </div>

              <button
                onClick={() => setOrderAddress(addr)}
                className="w-full py-3 rounded-xl bg-surface border-2 border-border text-foreground font-bold hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
              >
                Deliver Here
              </button>
            </div>
          ))}

          <button
            onClick={() => setSetMode(true)}
            className="min-h-[200px] flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all duration-300 group"
          >
            <div className="p-4 rounded-full bg-surface group-hover:bg-white transition-colors shadow-sm">
              <Plus size={24} className="text-text-muted group-hover:text-primary transition-colors" />
            </div>
            <span className="font-bold text-text-secondary group-hover:text-primary transition-colors">Add New Address</span>
          </button>
        </div>
      )}
    </div>
  );
}
