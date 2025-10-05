"use client";
import React, { useEffect, useState } from "react";
import { MapPin, User, Star, Calendar, XCircle } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import Loader from "@/components/ui/Loader";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { useAuth } from "@/components/providers/AuthProvider";
import MenuItem from "./_components/MenuItem";

export default function RestaurantPage({ resolvedParams }) {
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState({});
  const { serverURL } = useAuth();

  useEffect(() => {
    const fetchData = async (url) => {
      try {
        setLoading(true);
        const response = await axios.get(url);
        const data = response.data;
        setRestaurant(data.restaurant);
        console.log(data.restaurant);
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message || "Something went wrong", {
            icon: <XCircle className="w-6 h-6" />,
            duration: 5000,
          });
          console.log("Error data:", error.response.data);
        } else {
          toast.error(error.message || "Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };
    const url = `${serverURL}/api/restaurant/${resolvedParams.restaurantID}`;
    fetchData(url);
  }, []);

  return (
    <>
      {!loading ? (
        <div className="min-h-[30vh] bg-background text-foreground font-sans">
          {restaurant.name ? (
            <>
              <div className="relative h-64 w-full">
                <img
                  src={`${
                    process.env.NEXT_PUBLIC_SERVER_URL
                  }${restaurant.banner.replace("public", "")}`}
                  alt={restaurant.name}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
              <div className="max-w-5xl mx-auto p-6 space-y-6">
                {/* Basic Info */}
                <div className="bg-surface p-6 rounded-2xl border border-border shadow-md space-y-4">
                  <div>
                    <h1 className="text-2xl font-bold text-primary text-shadow-2xs stroke-2 drop-shadow-lg">
                      {restaurant.name.toUpperCase()}
                    </h1>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-secondary" />
                    <p className="font-semibold">
                      Owned by{" "}
                      <span className="text-primary">
                        {restaurant.owner.name}
                      </span>
                    </p>
                    <span
                      className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${
                        restaurant.owner.status === "active"
                          ? "bg-success text-white"
                          : "bg-info text-foreground"
                      }`}
                    >
                      {restaurant.owner.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-text-secondary">
                    <MapPin className="w-4 h-4" />
                    <p>{restaurant.address.raw}</p>
                  </div>

                  <div className="flex items-center gap-2 text-text-secondary">
                    <Calendar className="w-4 h-4" />
                    <p>
                      Joined on{" "}
                      {new Date(restaurant.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <Star
                      className={`w-5 h-5 ${
                        restaurant.rating > 0
                          ? "text-yellow-400"
                          : "text-border"
                      }`}
                      fill={restaurant.rating > 0 ? "currentColor" : "none"}
                    />
                    {restaurant.rating > 0 ? (
                      <p className="font-semibold">{restaurant.rating} / 5</p>
                    ) : (
                      <p className="text-text-muted">No ratings yet</p>
                    )}
                  </div>
                </div>
                <MenuItem />
              </div>
            </>
          ) : (
            <ErrorMessage message="No restaurant found!" />
          )}
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
}
