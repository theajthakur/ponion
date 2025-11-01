import React, { useEffect, useState } from "react";
import SavedAddresses from "./SavedAddress";
import InputAddress from "./InputAddress";
import useAddresses from "./utils";
import { Plus } from "lucide-react";

export default function address() {
  const [setMode, setSetMode] = useState(false);
  const { addresses, addAddress, removeAddress } = useAddresses();
  return (
    <div>
      {setMode ? (
        <InputAddress onBack={() => setSetMode(false)} onSave={addAddress} />
      ) : (
        <>
          <SavedAddresses addresses={addresses} />
          <div className="mt-5 flex justify-center">
            <button
              onClick={() => setSetMode(true)}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-2xl hover:bg-[var(--color-primary-hover)] transition"
            >
              <Plus size={18} /> Add Address
            </button>
          </div>
        </>
      )}
    </div>
  );
}
