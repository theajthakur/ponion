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
  const [error, setError] = useState(null);
  const restaurantID = resolvedParams.restaurantID;

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
          const errorMessage =
            error.response.data.message || "Something went wrong";
          toast.error(errorMessage, {
            icon: <XCircle className="w-6 h-6" />,
            duration: 5000,
          });
          setError(errorMessage);
          console.log("Error data:", error.response.data);
        } else {
          toast.error(error.message || "Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };
    const url = `${serverURL}/api/restaurant/${restaurantID}`;
    fetchData(url);
  }, []);

  return (
    <>
      {!loading ? (
        <div className="min-h-screen bg-background text-foreground font-sans pb-20">
          {restaurant.name ? (
            <>
              {/* Hero Section */}
              <div className="relative h-[40vh] lg:h-[50vh] w-full overflow-hidden">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <img
                  src={restaurant.banner}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 w-full z-20 bg-gradient-to-t from-black/80 to-transparent pt-20 pb-10 px-4 sm:px-6 lg:px-8">
                  <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight">
                      {restaurant.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm sm:text-base font-medium">
                      <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span>
                          {restaurant.rating > 0 ? restaurant.rating : "New"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                        <User className="w-4 h-4" />
                        <span>{restaurant.owner.name}</span>
                      </div>
                      <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                        <MapPin className="w-4 h-4" />
                        <span>{restaurant.address.raw}</span>
                      </div>
                      <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Since {new Date(restaurant.createdAt).getFullYear()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sticky Header for Mobile/Scroll */}
              <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-md border-b border-border shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-foreground truncate">
                    Menu
                  </h2>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        restaurant.owner.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {restaurant.owner.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Menu Section */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <MenuItem restaurantID={restaurantID} />
              </div>
            </>
          ) : (
            <ErrorMessage message={error || "No restaurant found!"} />
          )}
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
}
