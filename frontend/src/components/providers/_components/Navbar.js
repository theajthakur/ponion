"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAuth } from "../AuthProvider";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  let drptme;
  const [dropDown, setDropDown] = useState(false);
  return (
    <motion.nav
      className="w-full bg-background shadow-md"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <a href="/" className="text-2xl font-bold text-primary">
              <Image
                src={"/logo_text.png"}
                alt="PONION LOGO"
                width={200}
                height={50}
              />
            </a>
          </div>

          <div className="ms-auto">
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
                <p className="text-[#888888] hover:text-black cursor-pointer flex items-center gap-1">
                  Welcome <b>{user.name.split(" ")[0]}</b>
                  <ChevronDown
                    className={`w-4 h-4 transform transition-transform duration-300 ${
                      dropDown ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </p>

                {dropDown && (
                  <motion.div
                    initial={{ y: 100, opacity: 0, rotate: -10 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    transition={{ duration: 0.5, ease: "backInOut" }}
                    className="absolute z-50 right-0 mt-2 bg-white border border-gray-200 min-w-[200px] sm:min-w-[250px] rounded-md shadow-md py-2"
                  >
                    <a
                      href="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      Profile
                    </a>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 rounded-md"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <a
                href="/login"
                className="px-4 py-2 rounded-md text-white bg-primary hover:bg-primary-hover transition-colors duration-200 font-medium"
              >
                Login
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
