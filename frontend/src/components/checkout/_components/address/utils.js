import { useState, useEffect } from "react";

export default function useAddresses() {
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ponion_addresses");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setAddresses(parsed);
          console.log(parsed);
        } else {
          throw new Error("Invalid address format in storage");
        }
      }
    } catch (err) {
      console.error("Error loading addresses:", err);
      localStorage.removeItem("ponion_addresses");
    }
  }, []);

  const saveAddresses = (newAddresses) => {
    try {
      localStorage.setItem("ponion_addresses", JSON.stringify(newAddresses));
      setAddresses(newAddresses);
    } catch (err) {
      console.error("Error saving addresses:", err);
    }
  };

  const addAddress = (address) => {
    const requiredFields = [
      "Name",
      "Mobile",
      "Flat",
      "Landmark",
      "Area",
      "PinCode",
      "District",
      "State",
    ];

    for (const field of requiredFields) {
      if (!address[field]) {
        console.warn(`Missing field: ${field}`);
        return false;
      }
    }

    const updated = [...addresses, address];
    saveAddresses(updated);
    return true;
  };

  const removeAddress = (index) => {
    const updated = addresses.filter((_, i) => i !== index);
    saveAddresses(updated);
  };

  return { addresses, addAddress, removeAddress };
}
