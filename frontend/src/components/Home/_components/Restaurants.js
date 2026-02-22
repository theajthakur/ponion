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
  const [loading, setLoading] = useState(true);
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
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    key={rest._id}
                    className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border hover:-translate-y-1"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={rest.banner || "restaurants/demo.avif"}
                        alt={rest.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-foreground shadow-sm">
                        20-30 min
                      </div>
                      {rest.owner.rating > 0 && (
                        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="font-bold text-sm">
                            {rest.owner.rating}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                          {rest.name}
                        </h2>
                      </div>

                      <p className="text-secondary text-sm mb-4 line-clamp-2">
                        {rest.description ||
                          "Experience the best food in town with our specially curated menu."}
                      </p>

                      <div className="space-y-2 mb-6">
                        <div className="flex items-center gap-2 text-sm text-muted">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span className="truncate">
                            {rest.address.raw || "Location not available"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted">
                          <User className="w-4 h-4 text-primary" />
                          <span>{rest.owner.name}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          window.location.href = `/restaurant/${rest?.restaurantId}`;
                        }}
                        className="w-full py-3 rounded-xl bg-surface border-2 border-primary/10 text-primary font-bold hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group-hover:border-primary"
                      >
                        View Menu <ArrowRight className="w-4 h-4" />
                      </button>
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
                <p className="text-sm text-secondary">
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
