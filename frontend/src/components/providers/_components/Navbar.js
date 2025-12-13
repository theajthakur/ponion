"use client";
import { motion } from "framer-motion";
import { useAuth } from "../AuthProvider";
import { ChevronDown, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "../CartProvider";
import { usePathname } from "next/navigation";
export default function Navbar() {
  const { user, logout } = useAuth();
  const { setOpenCart } = useCart();
  const { cart } = useCart();
  let drptme;
  const [dropDown, setDropDown] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    if (pathname == "/login" && user) {
      logout();
      return;
    }
  }, []);
  return (
    <motion.nav
      className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 border-b border-white/20 shadow-sm"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex-shrink-0">
            <a href="/" className="text-3xl font-black tracking-tighter text-primary flex items-center gap-2">
              <span className="text-4xl">🍅</span> PONION
            </a>
          </div>

          <div className="ms-auto">
            <div className="flex gap-4 sm:gap-6 justify-center items-center">
              <div
                className="relative group cursor-pointer"
                onClick={() => {
                  setOpenCart((prev) => !prev);
                }}
              >
                <div className="p-2 rounded-full bg-secondary/10 group-hover:bg-secondary/20 transition-colors">
                  <ShoppingCart className="text-secondary w-6 h-6" />
                </div>
                {cart.length > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 flex justify-center items-center bg-primary text-white text-xs font-bold rounded-full border-2 border-white">
                    {cart.length}
                  </div>
                )}
              </div>
              {user ? (
                <div
                  className="relative"
                  onMouseLeave={() => {
                    drptme = setTimeout(() => {
                      setDropDown(false);
                    }, 100);
                  }}
                  onMouseEnter={() => {
                    setDropDown(true);
                    clearTimeout(drptme);
                  }}
                >
                  <p className="text-foreground font-medium hover:text-primary cursor-pointer flex items-center gap-1 transition-colors">
                    Hi, <b>{user.name.split(" ")[0]}</b>
                    <ChevronDown
                      className={`w-4 h-4 transform transition-transform duration-300 ${dropDown ? "rotate-180" : "rotate-0"
                        }`}
                    />
                  </p>

                  {dropDown && (
                    <motion.div
                      initial={{ y: 10, opacity: 0, scale: 0.95 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute z-50 right-0 mt-2 bg-white/90 backdrop-blur-xl border border-white/20 min-w-[200px] rounded-xl shadow-xl py-2 overflow-hidden"
                    >
                      <a
                        href="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        Profile
                      </a>
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </div>
              ) : (
                <a
                  href="/login"
                  className="px-6 py-2.5 rounded-full text-white bg-primary hover:bg-primary-hover shadow-lg shadow-primary/30 transition-all duration-300 font-bold transform hover:-translate-y-0.5"
                >
                  Login
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
