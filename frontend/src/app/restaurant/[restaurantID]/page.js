import RestaurantPage from "@/components/restaurant/Restaurant";
import React from "react";

export default function page({ params }) {
  const resolvedParams = React.use(params);
  return <RestaurantPage resolvedParams={resolvedParams} />;
}
