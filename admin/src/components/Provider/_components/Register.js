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
        <Box>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              width: "100%",
              maxWidth: 500,
              borderRadius: 3,
              backgroundColor: "var(--color-card)",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                mb: 3,
                fontWeight: "bold",
                color: "var(--color-foreground)",
                fontFamily: "var(--font-sans)",
              }}
            >
              Restaurant Registration
            </Typography>

            {loading ? (
              <Box>
                <Typography sx={{ mb: 2 }}>Submitting...</Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {Array(7)
                    .fill(0)
                    .map((_, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          height: 40,
                          backgroundColor: "#e0e0e0",
                          borderRadius: 1,
                        }}
                      />
                    ))}
                </Box>
              </Box>
            ) : (
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  type="email"
                  name="email"
                  label="Email"
                  variant="outlined"
                  value={formData.email}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail />
                      </InputAdornment>
                    ),
                  }}
                  required
                />

                <TextField
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  name="password"
                  label="Password"
                  variant="outlined"
                  value={formData.password}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  required
                />

                <TextField
                  fullWidth
                  name="name"
                  label="Full Name"
                  variant="outlined"
                  value={formData.name}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                  required
                />

                <TextField
                  select
                  fullWidth
                  name="gender"
                  label="Gender"
                  variant="outlined"
                  value={formData.gender}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                  required
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </TextField>

                <TextField
                  fullWidth
                  name="restaurantName"
                  label="Restaurant Name"
                  variant="outlined"
                  value={formData.restaurantName}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                  required
                />
                <TextField
                  fullWidth
                  name="address"
                  label="Address of Restaurant"
                  variant="outlined"
                  onChange={handleChange}
                  value={formData?.address?.raw}
                  sx={{ mb: 3 }}
                />

                <div className="mb-5">
                  <SingleImageUploader
                    onChange={(file) => setUploadedImage(file)}
                  />
                </div>

                {/* Hidden latitude & longitude */}
                <input type="hidden" name="lat" value={formData.lat} />
                <input type="hidden" name="lng" value={formData.lng} />

                <Button
                  type="submit"
                  fullWidth
                  sx={{
                    backgroundColor: "var(--color-primary)",
                    color: "var(--color-card)",
                    "&:hover": { backgroundColor: "var(--color-secondary)" },
                    py: 1.5,
                    fontWeight: "bold",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  Register
                </Button>
              </form>
            )}
          </Paper>
        </Box>
      )}
    </>
  );
}
