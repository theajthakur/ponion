import React, { useState } from "react";
import SavedAddresses from "./SavedAddress";
import InputAddress from "./InputAddress";
import useAddresses from "./utils";
import { Plus, Loader2 } from "lucide-react";

export default function Address() {
  const [setMode, setSetMode] = useState(false);
  const { addresses, loading, addAddress, removeAddress } = useAddresses();
  const [orderAddress, setOrderAddress] = useState(null);

  const handleSaveNewAddress = async (newAddr) => {
    const savedAddress = await addAddress(newAddr);
    if (savedAddress) {
      setOrderAddress(savedAddress);
      setSetMode(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {setMode ? (
        <InputAddress onBack={() => setSetMode(false)} onSave={handleSaveNewAddress} />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              {orderAddress ? "Confirm Order" : "Select Delivery Address"}
            </h2>
            {!orderAddress && (
              <button
                onClick={() => setSetMode(true)}
                className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl hover:bg-primary-hover transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/40 font-semibold"
              >
                <Plus size={18} strokeWidth={2.5} /> Add New
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-16 bg-surface rounded-2xl border border-border">
              <Loader2 className="animate-spin text-primary w-8 h-8" />
            </div>
          ) : (
            <SavedAddresses
              addresses={addresses}
              orderAddress={orderAddress}
              setOrderAddress={setOrderAddress}
              setSetMode={setSetMode}
              removeAddress={removeAddress}
            />
          )}
        </div>
      )}
    </div>
  );
}
