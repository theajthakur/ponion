"use client";

import { useRef } from "react";
import { Confetti } from "../confetti";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

export function OrderConfirmed() {
  const confettiRef = useRef(null);

  return (
    <div className="bg-background relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg">
      <div className="relative z-50">
        <motion.h2
          initial={{ opacity: 0, y: 50, scale: 0 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="text-4xl text-primary"
        >
          Congratulations! Order Confirmed
        </motion.h2>
        <div className="text-center">
          <motion.button
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-3 bg-primary hover:bg-primary/90 cursor-pointer text-white rounded-2xl mt-5"
          >
            <div className="flex justify-center gap-3">
              <ShoppingCart /> View Order
            </div>
          </motion.button>
        </div>
      </div>
      <Confetti
        ref={confettiRef}
        className="absolute top-0 left-0 z-0 size-full"
        onMouseEnter={() => {
          confettiRef.current?.fire({});
        }}
      />
    </div>
  );
}
