"use client";
import { useAuth } from "@/components/Provider/AuthProvider";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import { toast } from "sonner";

export default function RestaurantList() {
  const { token, user } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const activateRestaurantStatus = async (ownerId) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/${user.role}/user/approve`,
        { ownerId },
        {
          headers: { Authorization: token },
        }
      );
      toast.success("Activated!");
      setRestaurants((prev) =>
        prev.map((restaurant) => {
          if (restaurant.owner && restaurant.owner._id === ownerId) {
            return {
              ...restaurant,
              owner: {
                ...restaurant.owner,
                status: "active",
              },
            };
          }
          return restaurant;
        })
      );
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/${user.role}/restaurants`,
          {
            headers: { Authorization: token },
          }
        );
        setRestaurants(response.data?.restaurants || []);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  useEffect(() => {
    if (!error) return;
    toast.error(error);
  }, [error]);

  const filteredRestaurants = restaurants.filter((rest) => {
    const matchesSearch =
      rest.name.toLowerCase().includes(search.toLowerCase()) ||
      rest.owner.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || rest.owner.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error)
    return (
      <Typography variant="h6" className="text-center text-red-500 mt-4">
        Error: {error}
      </Typography>
    );
  if (!restaurants || restaurants.length === 0)
    return (
      <Typography variant="h6" align="center" sx={{ mt: 4 }}>
        No restaurants found
      </Typography>
    );

  return (
    <Box className="p-6 flex flex-col gap-4">
      {/* Filters */}
      <Box className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/3"
        />
        <TextField
          select
          label="Status"
          variant="outlined"
          size="small"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-1/4"
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="pending_email">Pending</MenuItem>
          <MenuItem value="active">Active</MenuItem>
        </TextField>
      </Box>

      {/* Restaurant Cards */}
      {filteredRestaurants.length === 0 && (
        <Typography variant="body1" className="text-center text-text-secondary">
          No matching restaurants
        </Typography>
      )}

      {filteredRestaurants.map((rest) => (
        <Paper
          key={rest._id}
          elevation={3}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-xl bg-surface border border-border shadow-md"
        >
          <Box className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Box>
              <Typography className="text-foreground font-bold text-lg">
                {rest.name}
              </Typography>
              <Typography className="text-text-secondary text-sm mt-1">
                {rest.owner.name} ({rest.owner.role})
              </Typography>
              {rest.address?.raw ? (
                <Typography className="text-text-secondary text-sm mt-1 break-all">
                  {rest.address.raw}
                </Typography>
              ) : (
                <Typography className="text-red-400 text-sm mt-1">
                  No Address Given
                </Typography>
              )}
            </Box>
          </Box>

          <Box className="flex flex-col sm:flex-row gap-2 sm:items-center mt-4 sm:mt-0">
            <Typography
              className={`px-2 py-1 rounded-full text-xs font-bold ${
                rest.owner.status === "pending_email"
                  ? "bg-warning text-card"
                  : rest.owner.status === "active"
                  ? "bg-success text-card"
                  : "bg-info text-card"
              }`}
            >
              {rest.owner.status.replace("_", " ").split(" ")[0]}
            </Typography>

            {rest.owner.status === "pending_email" && (
              <Button
                onClick={() => {
                  activateRestaurantStatus(rest.owner._id);
                }}
                variant="contained"
                sx={{
                  backgroundColor: "var(--color-success)",
                  color: "var(--color-card)",
                  "&:hover": { backgroundColor: "var(--color-white)" },
                  py: 0.5,
                  px: 2,
                  fontSize: 14,
                  fontWeight: "bold",
                }}
              >
                Activate
              </Button>
            )}

            <Button
              variant="contained"
              sx={{
                backgroundColor: "var(--color-primary)",
                color: "var(--color-card)",
                "&:hover": { backgroundColor: "var(--color-secondary)" },
                py: 0.5,
                px: 2,
                fontSize: 14,
                fontWeight: "bold",
              }}
            >
              View
            </Button>
          </Box>
        </Paper>
      ))}
    </Box>
  );
}
