import React from "react";
import Hero from "./_components/Hero";
import Restaurants from "./_components/Restaurants";
import Divider from "../ui/Divider";

export default function Home() {
  return (
    <div>
      <Hero />
      <Divider />
      <Restaurants />
    </div>
  );
}
