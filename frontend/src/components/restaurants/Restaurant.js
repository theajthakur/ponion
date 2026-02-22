"use client";
import { Clock, IndianRupee, Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import Input from "../ui/Input";

export default function RestaurantViewer() {
  const [restaurants, setRestaurants] = useState([]);
  const [filtered, setFiltered] = useState([]);
  useEffect(() => {
    fetch("/json/restaurants.json")
      .then((res) => res.json())
      .then((data) => {
        setRestaurants(data);
        setFiltered(data);
      });
  }, []);
  return (
    <div className="restaurants-container">
      <div className="flex gap-2">
        <div className="filter-container w-sm border-r-2 p-3">
          <div className="search-container">
            <Input placeholder={"Search Restaurants"} />
          </div>
        </div>
        <div className="result-container h-[100vh] overflow-y-scroll">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered?.length > 0 &&
              filtered.map((e) => (
                <div
                  key={e.id}
                  className="flex flex-col sm:flex-row gap-4 bg-surface border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200"
                >
                  {/* Image */}
                  <div className="sm:w-1/3 w-full h-48 sm:h-auto overflow-hidden">
                    <img
                      src={e.image}
                      alt={e.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="sm:w-2/3 p-4 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {e.name}
                      </h3>
                      <p className="text-secondary mb-2">{e.cuisine}</p>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-foreground">
                          {e.rating}
                        </span>
                      </div>

                      {/* Delivery Time & Price */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-primary" />
                          <span className="text-sm text-secondary">
                            {e.deliveryTime} mins
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Badge / CTA */}
                    <div className="mt-4">
                      <span className="inline-block bg-accent-surface text-primary text-xs font-semibold px-2 py-1 rounded">
                        Fast Delivery
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
