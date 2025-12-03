"use client";

import React, { useState } from "react";
import { ArrowLeftSquare, MapPin, Save } from "lucide-react";

export default function InputAddress({ onSave, onBack }) {
  const [formData, setFormData] = useState({
    Name: "",
    Mobile: "",
    Flat: "",
    Landmark: "",
    Area: "",
    PinCode: "",
    District: "",
    State: "",
    Label: "Home",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const emptyField = Object.entries(formData).find(
      ([_, v]) => v.trim() === ""
    );
    if (emptyField) {
      alert(`Please fill ${emptyField[0]}`);
      return;
    }
    onSave?.({ id: Date.now(), ...formData });
    setFormData({
      Name: "",
      Mobile: "",
      Flat: "",
      Landmark: "",
      Area: "",
      PinCode: "",
      District: "",
      State: "",
      Label: "Home",
    });
  };

  const fields = [
    "Name",
    "Mobile",
    "Flat",
    "Landmark",
    "Area",
    "PinCode",
    "District",
    "State",
  ];

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
          className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors font-medium px-3 py-1.5 rounded-lg hover:bg-surface"
          onClick={onBack}
        >
          <ArrowLeftSquare size={20} />
          <span>Back</span>
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {fields.map((field) => (
          <div key={field} className="space-y-2">
            <label className="text-sm font-semibold text-foreground ml-1">
              {field}
            </label>
            <input
              type={field === "Mobile" || field === "PinCode" ? "number" : "text"}
              value={formData[field]}
              onChange={(e) => handleChange(field, e.target.value)}
              placeholder={`Enter ${field}`}
              className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-surface hover:bg-white"
            />
          </div>
        ))}

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground ml-1">
            Address Type
          </label>
          <select
            value={formData.Label}
            onChange={(e) => handleChange("Label", e.target.value)}
            className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-surface hover:bg-white cursor-pointer appearance-none"
          >
            <option>Home</option>
            <option>Office</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      <div className="pt-6 flex justify-end border-t border-border mt-6">
        <button
          type="submit"
          className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl hover:bg-primary-hover transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40 font-bold text-lg hover:-translate-y-0.5"
        >
          <Save size={20} /> Save Address
        </button>
      </div>
    </form>
  );
}
