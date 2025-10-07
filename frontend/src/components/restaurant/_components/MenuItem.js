import { useAuth } from "@/components/providers/AuthProvider";
import Loader from "@/components/ui/Loader";
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
        <div className="bg-surface p-6 rounded-2xl border border-border shadow-md">
          <h2 className="text-xl font-semibold mb-4">Menu</h2>
          {menu.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-text-muted py-10">
              <p>No items available yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {menu.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white rounded-xl border border-border shadow hover:shadow-lg transition"
                >
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-text-secondary text-sm">
                    {item.description}
                  </p>
                  <p className="mt-2 text-primary font-bold">₹{item.price}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
