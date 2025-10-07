import { motion } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import AdminLogin from "./Login";
import RestaurantRegisterForm from "./Register";

export default function Auth() {
  const centerDivRef = useRef(null);
  const centerPosRef = useRef({ x: 0, y: 0 });
  const [eyePos, setEyePos] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(true);
  const [blink, setBlink] = useState(false);

  const updateCenterPos = () => {
    if (centerDivRef.current) {
      const rect = centerDivRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      centerPosRef.current = { x: centerX, y: centerY };
    }
  };

  useEffect(() => {
    updateCenterPos();
    window.addEventListener("resize", updateCenterPos);

    const handleMouseMove = (event) => {
      const dx = event.clientX - centerPosRef.current.x;
      const dy = event.clientY - centerPosRef.current.y;

      const maxDistance = 10;
      const angle = Math.atan2(dy, dx);
      const distance = Math.min(Math.sqrt(dx * dx + dy * dy), maxDistance);

      const x = distance * Math.cos(angle);
      const y = distance * Math.sin(angle);

      setEyePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", updateCenterPos);
    };
  }, []);

  const handleToggle = (status) => {
    if (status) return setBlink(false);
    return setBlink(true);
  };

  return (
    <div className="md:flex w-full h-screen select-none">
      <div className="hidden md:flex flex-col justify-center items-center bg-blue-200 h-full w-full">
        <div className="mb-10 text-center bg-white px-5 py-2 rounded-2xl">
          <p className="text-primary text-2xl">
            {blink
              ? "I swear, I am not seeing you!"
              : "Login using your Credentials!"}
          </p>
        </div>
        <div
          className="p-3"
          ref={centerDivRef}
          onClick={() => {
            setBlink(!blink);
          }}
        >
          <div className="flex justify-center gap-10 relative ">
            <div className="bg-black p-3 rounded-full w-16 h-16 flex items-center justify-center overflow-hidden">
              {!blink && (
                <motion.div
                  className="bg-white w-6 h-6 rounded-full"
                  animate={{ x: eyePos.x, y: eyePos.y }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              )}
              <img
                src={"/assets/palm.png"}
                className={` transition-all absolute left-[-40px] top-0 ${
                  blink ? "" : "left-[-100px] top-[100px]"
                }`}
                width={100}
                style={{ rotate: "45deg" }}
              />
            </div>

            <div className="bg-black p-3 rounded-full w-16 h-16 flex items-center justify-center overflow-hidden">
              {!blink && (
                <motion.div
                  className="bg-white w-6 h-6 rounded-full"
                  animate={{ x: eyePos.x, y: eyePos.y }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              )}
              <img
                src={"/assets/palm.png"}
                className={` transition-all absolute right-[-40px] top-0 ${
                  blink ? "" : "right-[-100px] top-[100px]"
                }`}
                width={100}
                style={{ transform: "rotateY(180deg)", rotate: "-45deg" }}
              />
            </div>
          </div>

          <div className="w-full overflow-hidden rounded-full">
            <div className="bg-black p-3 mt-5"></div>
          </div>
        </div>
      </div>

      <div className="flex h-full w-full justify-center items-center overflow-y-scroll">
        {active ? (
          <AdminLogin onToggle={handleToggle} />
        ) : (
          <RestaurantRegisterForm onToggle={handleToggle} />
        )}
      </div>
    </div>
  );
}
