"use client";
import React, { useEffect } from "react";

import Sidebar from "./_components/Sidebar";
import { Box } from "@mui/material";
import { Toaster } from "sonner";
import { useAuth } from "./AuthProvider";
import AuthContainer from "./_components/Auth";
import AdminLoading from "./_components/Loader";

export default function MainProvider({ children }) {
  const { user, loading } = useAuth();
  return (
    <>
      {loading ? (
        <AdminLoading />
      ) : (
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
                <Box sx={{ p: 3 }}>{children}</Box>
              </Box>
            </Box>
          ) : (
            <AuthContainer />
          )}
          <Toaster position="top-right" richColors />
        </Box>
      )}
    </>
  );
}
