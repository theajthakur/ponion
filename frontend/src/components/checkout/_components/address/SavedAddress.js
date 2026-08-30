"use client";

import React from "react";
import { MapPin, Home, Building2, Plus, Trash2, CheckCircle2 } from "lucide-react";
import CheckoutConfirmation from "./CheckoutConfirmation";

export default function SavedAddresses({
  addresses = [],
  onAdd,
  setSetMode,
  orderAddress,
  setOrderAddress,
  removeAddress,
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
        <button
          onClick={() => setSetMode(true)}
          className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl hover:bg-primary-hover transition-all duration-300 shadow-md font-semibold"
        >
          <Plus size={18} /> Add New Address
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orderAddress ? (
        <CheckoutConfirmation address={orderAddress} onChange={() => setOrderAddress(null)} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((addr) => {
            const labelText = addr.label || addr.Label || "Home";
            const isOffice = labelText.toLowerCase().includes("office") || labelText.toLowerCase().includes("work");
            const addressId = addr._id || addr.id;

            return (
              <div
                key={addressId}
                className="group bg-white rounded-2xl p-6 shadow-sm border-2 border-transparent hover:border-primary/50 hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2.5 rounded-xl ${
                          isOffice
                            ? "bg-blue-50 text-blue-600"
                            : "bg-orange-50 text-orange-600"
                        }`}
                      >
                        {isOffice ? <Building2 size={20} /> : <Home size={20} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-foreground text-lg">{labelText}</h3>
                          {addr.isDefault && (
                            <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle2 size={12} /> Default
                            </span>
                          )}
                        </div>
                        {addr.Name && <p className="text-sm text-muted font-medium">{addr.Name}</p>}
                      </div>
                    </div>
                    {removeAddress && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeAddress(addressId);
                        }}
                        className="text-muted hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete Address"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                  <div className="space-y-1 mb-6 text-secondary text-sm leading-relaxed">
                    <p className="font-medium text-foreground">
                      {addr.flatNo || addr.Flat}, {addr.street || addr.Area}
                    </p>
                    {(addr.landmark || addr.Landmark) && (
                      <p className="text-muted">Near {addr.landmark || addr.Landmark}</p>
                    )}
                    <p>
                      {addr.city ? `${addr.city}, ` : ""}
                      {addr.district || addr.District}, {addr.state || addr.State} -{" "}
                      <span className="font-semibold text-foreground">
                        {addr.pincode || addr.PinCode}
                      </span>
                    </p>
                    {addr.Mobile && (
                      <p className="pt-2 flex items-center gap-2 text-muted">
                        <span>📞</span> {addr.Mobile}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setOrderAddress(addr)}
                  className="w-full py-3 rounded-xl bg-surface border-2 border-border text-foreground font-bold hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                >
                  Deliver Here
                </button>
              </div>
            );
          })}

          <button
            onClick={() => setSetMode(true)}
            className="min-h-[200px] flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all duration-300 group"
          >
            <div className="p-4 rounded-full bg-surface group-hover:bg-white transition-colors shadow-sm">
              <Plus size={24} className="text-muted group-hover:text-primary transition-colors" />
            </div>
            <span className="font-bold text-secondary group-hover:text-primary transition-colors">
              Add New Address
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
