"use client";
import React, { useEffect, useState } from "react";
import {
  MapPin,
  User,
  Calendar,
  Star,
  ArrowRight,
  CookingPot,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Loader from "@/components/ui/Loader";

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/restaurants`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        if (data.status != "success") return toast.error(data.message);
        setRestaurants(data.restaurants);
      } catch (error) {
        return toast.error("Error while fetching restaurants!");
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div>
          {restaurants.length > 0 ? (
            <div className="min-h-screen bg-background p-6">
              <h1 className="text-2xl font-bold text-foreground mb-6">
                Restaurants
              </h1>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {restaurants.map((rest) => (
                  <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, ease: "linear" }}
                    key={rest._id}
                    className="bg-surface border border-border rounded-2xl shadow hover:shadow-lg transition overflow-hidden flex flex-col"
                  >
                    <img
                      src={
                        rest.banner
                          ? process.env.NEXT_PUBLIC_SERVER_URL +
                            rest.banner.replace("public", "")
                          : "restaurants/demo.avif"
                      }
                      alt={rest.name}
                      className="h-40 w-full object-cover"
                    />

                    {/* Content */}
                    <div className="p-4 flex flex-col flex-1">
                      <h2 className="text-lg font-bold text-foreground">
                        {rest.name}
                      </h2>

                      <div className="mt-2 text-sm text-text-secondary flex items-center gap-2">
                        <User className="w-4 h-4 text-text-muted" />
                        <span>
                          {rest.owner.name} ({rest.owner.role})
                        </span>
                      </div>

                      <div className="mt-2 text-sm text-text-secondary flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-text-muted" />
                        <span>
                          {rest.address.raw || "No Address Available"}
                        </span>
                      </div>

                      <div className="mt-2 text-sm text-text-secondary flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-text-muted" />
                        <span>
                          {new Date(rest.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>

                      {/* Status Badge */}
                      <div className="mt-auto pt-5 flex w-full">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                            rest.owner.rating > 0
                              ? "bg-success text-card"
                              : "bg-info text-card"
                          }`}
                        >
                          {rest.owner.rating > 0 ? (
                            <>
                              <Star className="w-3 h-3" />
                              {rest.owner.rating}
                            </>
                          ) : (
                            "No Rating given"
                          )}
                        </span>
                        <button className="px-3 hover:px-4 transition-all duration-300 py-1 ms-auto cursor-pointer rounded-lg bg-secondary text-white font-semibold hover:bg-secondary-hover inline-flex items-center gap-2">
                          <ArrowRight />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex w-full min-h-[50vh] justify-center items-center">
              <div className="flex flex-col items-center justify-center bg-surface px-8 py-10 rounded-2xl shadow-md border border-border max-w-md text-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                  <CookingPot className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-lg font-semibold text-foreground mb-2">
                  No Restaurants Available
                </h2>
                <p className="text-sm text-text-secondary">
                  Currently, no restaurants are serving. Please check back
                  later!
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
