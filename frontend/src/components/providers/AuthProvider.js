"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // ✅ start as null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("ponion_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        console.log(decoded);
      } catch (err) {
        console.error("Invalid token:", err);
        toast.error("Invalid token");
        localStorage.removeItem("ponion_token");
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("ponion_token", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ponion_token");
    toast.success("Logout successfully");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export function ProtectedRoute({ children, allowedRoutes = [] }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user && !allowedRoutes.includes(pathname)) {
        router.push("/login");
      }
    }
  }, [user, loading, pathname, allowedRoutes, router]);

  if (loading || (!user && !allowedRoutes.includes(pathname))) {
    return (
      <div className="flex justify-center items-center min-h-screen text-text-secondary">
        Loading...
      </div>
    );
  }

  return children;
}
