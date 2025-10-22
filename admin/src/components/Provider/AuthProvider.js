"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import AdminLoading from "./_components/Loader";
import { globalItems } from "@/utils/roleRoute";
const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
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
      if (
        !globalItems
          .find((e) => e.path == pathname)
          ?.role?.includes(decoded.role)
      ) {
        router.push("/");
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
      setUserToken(token);
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
      value={{
        user,
        login,
        logout,
        loading,
        token: userToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
