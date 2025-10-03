"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import AdminLoading from "./_components/Loader";
const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("ponion_admin_token");
    if (!token) return setLoading(false);
    setUserToken(token);
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        throw new Error("Token expired");
      }
      setUser(decoded);
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem("ponion_admin_token");
      setUser(null);
      logout?.();
      toast.error(err.message || "Invalid or expired token");
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    try {
      localStorage.setItem("ponion_admin_token", token);
      setUser(jwtDecode(token));
    } catch (error) {
      logout();
    }
  };

  const logout = () => {
    toast.success("Logout successfully");
    setUser(null);
    localStorage.removeItem("ponion_admin_token");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading, token: userToken }}
    >
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
    return <AdminLoading />;
  }

  return children;
}
