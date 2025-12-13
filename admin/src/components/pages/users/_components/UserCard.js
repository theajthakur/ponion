import React, { useEffect, useState } from "react";
import { Mail, User, Shield, Calendar, Circle, User2 } from "lucide-react";
import Button from "@/ui/Button";
import { useAuth } from "@/components/Provider/AuthProvider";
import axios from "axios";
import { toast } from "sonner";

const UserCard = ({ users = [], setUsers }) => {
  const { token } = useAuth();

  const activeUser = async (ownerId) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/superadmin/user/approve`,
        { ownerId },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      setUsers((prev) =>
        prev.map((u) => (u._id === ownerId ? { ...u, status: "active" } : u))
      );
      toast.success(data.message);
    } catch (err) {
      console.error("Error approving user:", err);
      toast.error(err.message || "Something went wrong");
    }
  };
  const statusColors = {
    active: "bg-green-500",
    disabled: "bg-red-500",
    pending_email: "bg-yellow-500",
  };

  return (
    <div className="my-3">
      {users.length == 0 ? (
        <div className="flex w-full justify-center p-3 bg-white rounded shadow-2xs text-center text-primary">
          <div>
            <User2 className="mx-auto w-15 h-15 p-3 border-primary border-2 rounded-full" />
            <h3 className="my-3">No User found!</h3>
          </div>
        </div>
      ) : (
        <div>
          {users.map((user, i) => (
            <div
              key={i}
              className="w-full my-3 bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl p-5 flex flex-wrap sm:flex-nowrap items-center justify-between shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center space-x-4 min-w-[250px] mb-3 sm:mb-0">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white p-3 rounded-2xl shadow-md">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {user.name}
                  </h2>
                  <div className="flex items-center text-gray-600 text-sm space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-8 text-sm text-gray-700 mb-3 sm:mb-0">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-indigo-500" />
                  <span className="capitalize font-medium">{user.role}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              {user.status == "pending_email" && user.role == "admin" ? (
                <div className="flex">
                  <Button
                    onClick={() => {
                      activeUser(user._id);
                    }}
                  >
                    Activate
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Circle
                    className={`w-3 h-3 ${
                      statusColors[user.status] || "bg-gray-400"
                    } rounded-full`}
                    fill="currentColor"
                  />
                  <span className="capitalize text-sm font-medium text-gray-800">
                    {user.status}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserCard;
