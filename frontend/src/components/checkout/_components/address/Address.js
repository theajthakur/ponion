import React, { useEffect, useState } from "react";
import SavedAddresses from "./SavedAddress";
import InputAddress from "./InputAddress";
import useAddresses from "./utils";
import { Plus } from "lucide-react";

export default function Address() {
  const [setMode, setSetMode] = useState(false);
  const { addresses, addAddress, removeAddress } = useAddresses();
  const [orderAddress, setOrderAddress] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {setMode ? (
        <InputAddress onBack={() => setSetMode(false)} onSave={addAddress} />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Select Delivery Address</h2>
            {!orderAddress && (
              <button
                onClick={() => setSetMode(true)}
                className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl hover:bg-primary-hover transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/40 font-semibold"
              >
                <Plus size={18} strokeWidth={2.5} /> Add New
              </button>
            )}
          </div>

          <SavedAddresses
            addresses={addresses}
            orderAddress={orderAddress}
            setOrderAddress={setOrderAddress}
            setSetMode={setSetMode}
          />
        </div>
      )}
    </div>
  );
}
