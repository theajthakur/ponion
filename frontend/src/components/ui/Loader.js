"use client";
import React from "react";
import { Loader2 } from "lucide-react";

export default function Loader({ size = 48, text = "Loading..." }) {
  return (
    <div className="flex flex-col justify-center items-center min-h-[50vh]">
      <Loader2 size={size} className="animate-spin text-primary" />
      {text && <p className="mt-4 text-secondary font-medium">{text}</p>}
    </div>
  );
}
