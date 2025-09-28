import React from "react";
import PizzaViewer from "./_components/Pizza";

export default function Hero() {
  return (
    <section className="bg-white">
      <div className="container mx-auto px-6 py-16 flex flex-col-reverse lg:flex-row items-center">
        {/* Text Section */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Fast & Fresh Food Delivery
          </h1>
          <p className="text-gray-600 mb-6">
            Order your favorite meals from local restaurants and get them
            delivered quickly.
          </p>
          <div className="flex justify-center lg:justify-start gap-4">
            <button className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition">
              Order Now
            </button>
            <button className="bg-orange-400 text-white px-6 py-3 rounded-lg hover:bg-orange-500 transition">
              Explore Menu
            </button>
          </div>
        </div>

        {/* Image Section */}
        <div className="w-full lg:w-1/2 mb-10 lg:mb-0 flex justify-center lg:justify-end">
          <PizzaViewer />
        </div>
      </div>
    </section>
  );
}
