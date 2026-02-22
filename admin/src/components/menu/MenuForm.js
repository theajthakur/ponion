"use client";
import React, { useState } from "react";
import { Upload, Check, X } from "lucide-react";
import Input from "@/ui/Input";
import Button from "@/ui/Button";
import { toast } from "sonner";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useAuth } from "../Provider/AuthProvider";

const validationSchema = Yup.object({
  itemName: Yup.string().required("Item name is required"),
  price: Yup.number()
    .required("Price is required")
    .positive("Price must be positive"),
  available: Yup.boolean().required("Availability is required"),
  thumbnail: Yup.mixed().required("Thumbnail is required"),
  dietType: Yup.string().required("Diet type is required"),
});

export default function MenuForm({ className, onSave }) {
  const { token } = useAuth();

  const handleSubmit = async (values, { resetForm }) => {
    const data = new FormData();
    if (!values.thumbnail) return toast.error("Image required");
    data.append("itemName", values.itemName);
    data.append("price", values.price);
    data.append("available", values.available);
    data.append("thumbnail", values.thumbnail);
    data.append("dietType", values.dietType);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/menu/upload`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token,
          },
        }
      );
      if (response.data) onSave(response.data.newMenuItem);
      resetForm();
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  const handleImageChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    if (file) {
      setFieldValue("thumbnail", file);
    }
  };

  return (
    <Formik
      initialValues={{
        itemName: "",
        price: "",
        available: true,
        thumbnail: null,
        dietType: "veg",
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, values, errors, touched }) => (
        <Form
          className={`mx-auto bg-surface border border-border rounded-2xl shadow-sm p-6 space-y-5 ${className}`}
        >
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Add Menu Item
          </h2>

          <div>
            <label className="block text-sm font-medium text-secondary mb-1">
              Item Name
            </label>
            <Field
              name="itemName"
              type="text"
              className="w-full p-2.5 border border-border rounded-md"
              placeholder="e.g., Paneer Butter Masala"
            />
            <ErrorMessage
              name="itemName"
              component="div"
              className="text-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-1">
              Price (₹)
            </label>
            <Field
              name="price"
              type="number"
              className="w-full p-2.5 border border-border rounded-md"
              placeholder="e.g., 250"
            />
            <ErrorMessage
              name="price"
              component="div"
              className="text-red-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Field
              type="checkbox"
              name="available"
              className="w-4 h-4 accent-primary"
            />
            <label htmlFor="available" className="text-sm text-secondary">
              Available
            </label>
            <ErrorMessage
              name="available"
              component="div"
              className="text-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-1">
              Diet Type
            </label>
            <Field
              as="select"
              name="dietType"
              className="w-full p-2.5 border border-border rounded-md"
            >
              <option value="veg">Veg</option>
              <option value="egg">Egg</option>
              <option value="non_veg">Non-Veg</option>
            </Field>
            <ErrorMessage
              name="dietType"
              component="div"
              className="text-red-500"
            />
          </div>

          {/* Thumbnail Upload */}
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">
              Thumbnail
            </label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                name="thumbnail"
                onChange={(e) => handleImageChange(e, setFieldValue)}
                className="w-full p-2.5 border border-border rounded-md"
              />
              {values.thumbnail && (
                <span className="text-sm text-muted">
                  {values.thumbnail.name}
                </span>
              )}
              <Upload size={18} className="text-muted" />
            </div>
            <ErrorMessage
              name="thumbnail"
              component="div"
              className="text-red-500"
            />
          </div>

          <Button type="submit">
            <Check size={18} /> Save Item
          </Button>
        </Form>
      )}
    </Formik>
  );
}
