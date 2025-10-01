"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Navbar() {
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
            <a
              href="/login"
              className="px-4 py-2 rounded-md text-white bg-primary hover:bg-primary-hover transition-colors duration-200 font-medium"
            >
              Login
            </a>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
