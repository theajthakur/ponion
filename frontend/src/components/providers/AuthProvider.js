"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import UserLoading from "../ui/AdvancedLoader";
const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(undefined);
  const serverURL = process.env.NEXT_PUBLIC_SERVER_URL;

  useEffect(() => {
    const tokenRaw = localStorage.getItem("ponion_token");
    if (tokenRaw) {
      try {
        const decoded = jwtDecode(tokenRaw);
        setUser(decoded);
        setToken(tokenRaw);
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
    toast.success("Logout successfully");
    setUser(null);
    localStorage.removeItem("ponion_token");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading, serverURL, token }}
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

  const isAllowed = allowedRoutes.some((route) => {
    if (route.endsWith("/*")) {
      const baseRoute = route.replace("/*", "");
      return pathname.startsWith(baseRoute);
    }
    return pathname === route;
  });

  useEffect(() => {
    if (!loading && !user && !isAllowed) {
      router.push("/login");
    }
  }, [user, loading, pathname, isAllowed, router]);

  if (loading || (!user && !isAllowed)) {
    return <UserLoading />;
  }

  return children;
}
