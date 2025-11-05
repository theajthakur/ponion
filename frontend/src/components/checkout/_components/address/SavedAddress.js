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
    <div className="space-y-4">
      {orderAddress ? (
        <CheckoutConfirmation address={orderAddress} />
      ) : (
        addresses.map((addr) => (
          <div
            key={addr.id}
            className="bg-surface rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-start sm:justify-between border border-border hover:shadow-md transition"
          >
            <div className="flex items-start gap-3 mb-3 sm:mb-0">
              {addr.Label?.toLowerCase().includes("office") ? (
                <Building2 className="text-secondary" />
              ) : (
                <Home className="text-primary" />
              )}
              <div>
                <p className="font-semibold">{addr.Label || "Address"}</p>
                <p className="text-sm text-secondary">
                  {addr.Flat}, {addr.Area}, {addr.Landmark}
                </p>
                <p className="text-sm text-secondary">
                  {addr.District}, {addr.State} - {addr.PinCode}
                </p>
                <p className="text-sm text-muted mt-1">
                  {addr.Name} ({addr.Mobile})
                </p>
              </div>
            </div>
            <button
              onClick={() => setOrderAddress(addr)}
              className="self-end sm:self-start px-4 py-2 rounded-xl bg-accent-surface text-foreground font-medium hover:bg-primary hover:text-white transition"
            >
              Deliver Here
            </button>
          </div>
        ))
      )}
    </div>
  );
}
