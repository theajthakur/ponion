import { useAuth } from "@/components/providers/AuthProvider";
import Loader from "@/components/ui/Loader";
import UserMenu from "@/components/ui/MenuItem";
import axios from "axios";
import { XCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export default function MenuItem({ restaurantID }) {
  const { serverURL } = useAuth();
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async (url) => {
      try {
        setLoading(true);
        const response = await axios.get(url);
        const data = response.data;
        setMenu(data.menuItems);
        console.log(data.menuItems);
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
    const url = `${serverURL}/api/restaurant/${restaurantID}/menu`;
    fetchData(url);
  }, []);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-surface rounded-2xl px-2 md:px-6 border border-border shadow-md">
          <UserMenu items={menu} />
        </div>
      )}
    </>
  );
}
