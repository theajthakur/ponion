"use client";
import { useAuth } from "@/components/Provider/AuthProvider";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function page() {
  const [menu, setMenu] = useState([]);
  const { token, user } = useAuth();
  useEffect(() => {
    const restaurantId = user.restaurant.restaurantId;
    const fetchData = async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/restaurant/${restaurantId}/menu`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setMenu(res.data.menuItems);
    };
    fetchData();
  }, []);
  return (
    <div>
      {menu.length > 0 ? (
        <div>
          {menu.map((m, i) => {
            <div key={i}>
              <h1>{m.name}</h1>
            </div>;
          })}
        </div>
      ) : (
        "Nothing can be found"
      )}
    </div>
  );
}
