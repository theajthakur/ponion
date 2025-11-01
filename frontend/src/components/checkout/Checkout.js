"use client";
import React, { Suspense } from "react";
import Address from "./_components/address/Address";

export default function Checkout() {
  return (
    <Suspense fallback={"Loading..."}>
      <Address />
    </Suspense>
  );
}
