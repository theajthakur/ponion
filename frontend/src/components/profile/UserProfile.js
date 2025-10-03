"use client";
import React from "react";
import { User, Mail, Calendar, Shield, Activity, LogOut } from "lucide-react";
import { useAuth } from "../providers/AuthProvider";

export default function UserProfile() {
  const { user, logout } = useAuth();

  if (!user) {
    return logout();
  }

  return (
    <div className="flex justify-center items-center min-h-[70vh] bg-background">
      <div className="w-full max-w-md bg-card text-card-foreground rounded-2xl shadow-lg p-6">
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
            {user.name?.charAt(0)}
          </div>
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p className="text-sm text-muted-foreground capitalize">
            {user.role} • {user.status}
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Mail size={18} className="text-primary" />
            <p className="text-sm">{user.email}</p>
          </div>

          <div className="flex items-center gap-3">
            <User size={18} className="text-primary" />
            <p className="text-sm capitalize">{user.gender}</p>
          </div>

          <div className="flex items-center gap-3">
            <Calendar size={18} className="text-primary" />
            <p className="text-sm">
              Joined:{" "}
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Shield size={18} className="text-primary" />
            <p className="text-sm">Role: {user.role}</p>
          </div>

          <div className="flex items-center gap-3">
            <Activity size={18} className="text-primary" />
            <p className="text-sm">Status: {user.status}</p>
          </div>
        </div>
        <div className="flex justify-center items-center mt-5">
          <button
            onClick={logout}
            className="rounded px-4 py-2 bg-primary hover:bg-primary-hover cursor-pointer text-white flex gap-2"
          >
            <LogOut /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}
