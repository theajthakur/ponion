"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { toast } from "sonner";

export default function useAddresses() {
  const { token, serverURL } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAddresses = useCallback(async () => {
    if (!token || !serverURL) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${serverURL}/user/addresses`, {
        headers: {
          Authorization: token,
        },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.addresses)) {
        setAddresses(data.addresses);
      } else {
        console.error("Failed to fetch addresses:", data.message);
      }
    } catch (err) {
      console.error("Error fetching addresses:", err);
    } finally {
      setLoading(false);
    }
  }, [token, serverURL]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const addAddress = async (addressData) => {
    if (!token || !serverURL) {
      toast.error("Please login to save address");
      return false;
    }
    try {
      const res = await fetch(`${serverURL}/user/addresses`, {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addressData),
      });
      const data = await res.json();
      if (data.success && data.address) {
        toast.success("Address added successfully!");
        setAddresses((prev) => [data.address, ...prev]);
        return data.address;
      } else {
        toast.error(data.message || "Failed to save address");
        return false;
      }
    } catch (err) {
      console.error("Error saving address:", err);
      toast.error("Error saving address");
      return false;
    }
  };

  const removeAddress = async (addressId) => {
    if (!token || !serverURL) return false;
    try {
      const res = await fetch(`${serverURL}/user/addresses/${addressId}`, {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Address deleted successfully");
        setAddresses((prev) => prev.filter((a) => (a._id || a.id) !== addressId));
        return true;
      } else {
        toast.error(data.message || "Failed to delete address");
        return false;
      }
    } catch (err) {
      console.error("Error deleting address:", err);
      toast.error("Error deleting address");
      return false;
    }
  };

  return { addresses, loading, fetchAddresses, addAddress, removeAddress };
}
