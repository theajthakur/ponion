"use client";
import React, { useState } from "react";
import AuthProvider from "./AuthProvider";
import MainProvider from "./MainLayout";

export default function LayoutProvider({ children }) {
  return (
    <AuthProvider>
      <MainProvider>{children}</MainProvider>
    </AuthProvider>
  );
}
