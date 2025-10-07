"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Paper,
  Typography,
  MenuItem,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff, Mail } from "@mui/icons-material";
import { toast } from "sonner";
import SingleImageUploader from "./ImageUploader";
import SuccessRestaurantCreation from "./SuccessRestaurantCreation";
import { Eye, EyeOff } from "lucide-react";

export default function RestaurantRegisterForm() {
  const [registered, setRegistered] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    gender: "",
    restaurantName: "",
    address: {
      lat: "",
      lng: "",
      raw: "",
    },
  });
  const [uploadedImage, setUploadedImage] = useState(null);

  const getDeviceLocation = async () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        return reject(
          new Error("Geolocation is not supported by this browser.")
        );
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({
            lat: latitude.toString(),
            lng: longitude.toString(),
          });
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              reject(new Error("User denied the request for Geolocation."));
              break;
            case error.POSITION_UNAVAILABLE:
              reject(new Error("Location information is unavailable."));
              break;
            case error.TIMEOUT:
              reject(new Error("The request to get user location timed out."));
              break;
            default:
              reject(
                new Error("An unknown error occurred while fetching location.")
              );
              break;
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  };

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    if (e.target.name == "address") {
      const address = {
        raw: e.target.value,
      };
      setFormData({ ...formData, address });
      console.log({ ...formData, address });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const latLng = await getDeviceLocation();
      if (!latLng || !latLng.lat || !latLng.lng) {
        toast.error("Location is required!");
        return;
      }

      // Build FormData
      const formPayload = new FormData();
      formPayload.append("email", formData.email);
      formPayload.append("password", formData.password);
      formPayload.append("name", formData.name);
      formPayload.append("gender", formData.gender);
      formPayload.append("restaurantName", formData.restaurantName);
      formPayload.append("address[raw]", formData.address.raw);
      formPayload.append("address[lat]", latLng.lat);
      formPayload.append("address[lng]", latLng.lng);

      if (uploadedImage) {
        formPayload.append("image", uploadedImage);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/signup/restaurant`,
        {
          method: "POST",
          body: formPayload, // no JSON.stringify, send FormData directly
        }
      );

      const data = await res.json();
      if (data.status !== "success") {
        toast.error(data.message || "Something went wrong!");
      } else {
        toast.success(data.message || "Restaurant registered!");
        setRegistered(true);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to register restaurant");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {registered ? (
        <SuccessRestaurantCreation />
      ) : (
        <div className="flex justify-center items-center min-h-screen">
          <div className="bg-white">
            <div className="w-full max-w-md bg-card shadow-lg rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-5 text-foreground font-sans">
                Restaurant Registration
              </h2>

              {loading ? (
                <div>
                  <p className="mb-2 text-gray-600 font-medium">
                    Submitting...
                  </p>
                  <div className="flex flex-col gap-2">
                    {Array(7)
                      .fill(0)
                      .map((_, idx) => (
                        <div
                          key={idx}
                          className="h-10 bg-gray-300 rounded-md animate-pulse"
                        />
                      ))}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3 relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>

                  <div className="mb-3 relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  />

                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none text-gray-700"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>

                  <input
                    type="text"
                    name="restaurantName"
                    placeholder="Restaurant Name"
                    value={formData.restaurantName}
                    onChange={handleChange}
                    required
                    className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  />

                  <input
                    type="text"
                    name="address"
                    placeholder="Address of Restaurant"
                    value={formData.address.raw}
                    onChange={handleChange}
                    className="w-full mb-5 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  />

                  <div className="mb-5">
                    <SingleImageUploader
                      onChange={(file) => setUploadedImage(file)}
                    />
                  </div>

                  <input type="hidden" name="lat" value={formData.lat} />
                  <input type="hidden" name="lng" value={formData.lng} />

                  <button
                    type="submit"
                    className="w-full bg-primary text-card font-semibold font-sans py-3 rounded-lg hover:bg-secondary transition"
                  >
                    Register
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
