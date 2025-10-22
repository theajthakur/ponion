"use client";
import React, { useEffect, useState } from "react";
import MenuForm from "./MenuForm";
import MenuList from "./MenuList";
import { useAuth } from "../Provider/AuthProvider";
import axios from "axios";
import { toast } from "sonner";

export default function Menu() {
  const [menu, setMenu] = useState([]);
  const { user, token, logout } = useAuth();
  useEffect(() => {
    const restaurantId = user?.restaurant?.restaurantId;
    if (!restaurantId) {
      toast.error("Something went wrong!");
      return;
    }
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/restaurant/${restaurantId}/menu`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setMenu(res.data.menuItems);
      } catch (error) {
        logout();
      }
    };
    fetchData();
  }, []);
  const newFood = (food) => {
    setMenu((prev) => [...prev, food]);
  };

  return (
    <div className="flex gap-2 flex-col md:flex-row">
      <MenuForm onSave={newFood} className={"w-full md:w-[40%]"} />
      <MenuList data={menu} className={"w-full md:w-[60%]"} />
    </div>
  );
}
