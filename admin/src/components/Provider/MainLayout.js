"use client";
import React from "react";

import Sidebar from "./_components/Sidebar";
import { Box, Toolbar } from "@mui/material";
import { Toaster } from "sonner";
import { useAuth } from "./AuthProvider";
import AuthContainer from "./_components/Auth";

export default function MainProvider({ children }) {
  const { user } = useAuth();

  return (
    <Box>
      {user ? (
        <Box sx={{ display: "flex", height: "100vh" }}>
          <Sidebar />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              backgroundColor: "#F3F4F6",
              overflowY: "auto",
            }}
          >
            <Toolbar />
            <Box sx={{ p: 3 }}>{children}</Box>
          </Box>
        </Box>
      ) : (
        <AuthContainer />
      )}
      <Toaster position="top-right" richColors />
    </Box>
  );
}
