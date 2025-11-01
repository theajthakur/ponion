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
      className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-4"
    >
      <div
        className="flex gap-2 ms-auto text-black/70 hover:text-black cursor-pointer"
        onClick={onBack}
      >
        <ArrowLeftSquare />
        Go back
      </div>
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="text-primary" />
        <h2 className="text-xl font-semibold text-foreground">
          Add New Address
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {fields.map((field) => (
          <input
            key={field}
            type={field === "Mobile" || field === "PinCode" ? "number" : "text"}
            value={formData[field]}
            onChange={(e) => handleChange(field, e.target.value)}
            placeholder={field}
            className="border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
          />
        ))}

        <select
          value={formData.Label}
          onChange={(e) => handleChange("Label", e.target.value)}
          className="border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
        >
          <option>Home</option>
          <option>Office</option>
          <option>Other</option>
        </select>
      </div>

      <div className="pt-3">
        <button
          type="submit"
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-2xl hover:bg-primary-hover transition"
        >
          <Save size={18} /> Save Address
        </button>
      </div>
    </form>
  );
}
