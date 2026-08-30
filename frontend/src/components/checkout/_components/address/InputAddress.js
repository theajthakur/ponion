"use client";

import React, { useState } from "react";
import { ArrowLeftSquare, MapPin, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function InputAddress({ onSave, onBack }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    label: "Home",
    flatNo: "",
    street: "",
    landmark: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
    isDefault: false,
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      { key: "flatNo", label: "Flat / House No" },
      { key: "street", label: "Street / Area" },
      { key: "city", label: "City" },
      { key: "district", label: "District" },
      { key: "state", label: "State" },
      { key: "pincode", label: "Pincode" },
    ];

    for (const field of requiredFields) {
      if (!formData[field.key] || !formData[field.key].trim()) {
        toast.error(`Please enter ${field.label}`);
        return;
      }
    }

    const pinRegex = /^[1-9][0-9]{5}$/;
    if (!pinRegex.test(formData.pincode.trim())) {
      toast.error("Please enter a valid 6-digit Indian PIN Code");
      return;
    }

    setLoading(true);
    try {
      await onSave?.({
        label: formData.label.trim(),
        flatNo: formData.flatNo.trim(),
        street: formData.street.trim(),
        landmark: formData.landmark.trim(),
        city: formData.city.trim(),
        district: formData.district.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
        isDefault: formData.isDefault,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-border rounded-2xl p-8 shadow-lg space-y-6 max-w-3xl mx-auto"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <MapPin size={24} />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            Add New Address
          </h2>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 text-secondary hover:text-primary transition-colors font-medium px-3 py-1.5 rounded-lg hover:bg-surface"
          onClick={onBack}
        >
          <ArrowLeftSquare size={20} />
          <span>Back</span>
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground ml-1">
            Address Label / Type *
          </label>
          <select
            value={formData.label}
            onChange={(e) => handleChange("label", e.target.value)}
            className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-surface hover:bg-white cursor-pointer"
          >
            <option value="Home">Home</option>
            <option value="Office">Office</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground ml-1">
            Flat / House / Building No. *
          </label>
          <input
            type="text"
            value={formData.flatNo}
            onChange={(e) => handleChange("flatNo", e.target.value)}
            placeholder="e.g. Flat 402, Sunshine Apartments"
            className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-surface hover:bg-white"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground ml-1">
            Street / Area / Locality *
          </label>
          <input
            type="text"
            value={formData.street}
            onChange={(e) => handleChange("street", e.target.value)}
            placeholder="e.g. 10th Main Road, Indiranagar"
            className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-surface hover:bg-white"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground ml-1">
            Landmark (Optional)
          </label>
          <input
            type="text"
            value={formData.landmark}
            onChange={(e) => handleChange("landmark", e.target.value)}
            placeholder="e.g. Near Metro Station"
            className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-surface hover:bg-white"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground ml-1">
            City / Town *
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => handleChange("city", e.target.value)}
            placeholder="e.g. Bengaluru"
            className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-surface hover:bg-white"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground ml-1">
            District *
          </label>
          <input
            type="text"
            value={formData.district}
            onChange={(e) => handleChange("district", e.target.value)}
            placeholder="e.g. Bengaluru Urban"
            className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-surface hover:bg-white"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground ml-1">
            State *
          </label>
          <input
            type="text"
            value={formData.state}
            onChange={(e) => handleChange("state", e.target.value)}
            placeholder="e.g. Karnataka"
            className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-surface hover:bg-white"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground ml-1">
            PIN Code (6 digits) *
          </label>
          <input
            type="text"
            maxLength={6}
            value={formData.pincode}
            onChange={(e) => handleChange("pincode", e.target.value)}
            placeholder="e.g. 560038"
            className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-surface hover:bg-white"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2">
        <input
          type="checkbox"
          id="isDefault"
          checked={formData.isDefault}
          onChange={(e) => handleChange("isDefault", e.target.checked)}
          className="w-4 h-4 text-primary rounded focus:ring-primary cursor-pointer"
        />
        <label htmlFor="isDefault" className="text-sm font-medium text-secondary cursor-pointer">
          Set as default delivery address
        </label>
      </div>

      <div className="pt-6 flex justify-end border-t border-border mt-6">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl hover:bg-primary-hover transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40 font-bold text-lg hover:-translate-y-0.5 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Save size={20} />
          )}
          <span>Save Address</span>
        </button>
      </div>
    </form>
  );
}
