"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Skeleton,
} from "@mui/material";
import { Visibility, VisibilityOff, Mail } from "@mui/icons-material";
import { useAuth } from "../AuthProvider";
import { toast } from "sonner";

export default function AdminLogin({ onToggle }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      if (!email || !password) {
        setError("Please fill in all fields");
        return;
      }
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await res.json();
      if (data.status != "success")
        return toast.error(data.message || "Something went wrong!");
      toast.success(data.message || "...");
      login(data?.data.token);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setEmail("");
    setPassword("");
  }, [loading]);

  useEffect(() => {
    if (showPassword) return onToggle(false);
    return onToggle(true);
  }, [showPassword]);

  useEffect(() => {
    if (!error) return;
    toast.error(error);
  }, [error]);

  return (
    <Box sx={{ background: "white", borderRadius: "0" }}>
      {loading ? (
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "var(--color-background)",
            p: 2,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              width: "100%",
              maxWidth: 400,
              borderRadius: 3,
              backgroundColor: "var(--color-card)",
            }}
          >
            <Skeleton variant="text" height={40} width={300} sx={{ mb: 3 }} />
            <Skeleton variant="rectangular" height={56} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={56} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={48} />
          </Paper>
        </Box>
      ) : (
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: "100%",
            maxWidth: 400,
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              mb: 3,
              fontWeight: "bold",
              color: "var(--color-foreground)",
              fontFamily: "var(--font-sans)",
            }}
          >
            Admin Login
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              type="email"
              label="Email"
              variant="outlined"
              sx={{ mb: 3 }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              label="Password"
              variant="outlined"
              sx={{ mb: 3 }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => {
                onToggle(false);
                setShowPassword(false);
              }}
              autoComplete="false"
              onBlur={() => {
                onToggle(true);
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              sx={{
                backgroundColor: "var(--color-primary)",
                color: "var(--color-card)",
                "&:hover": { backgroundColor: "var(--color-secondary)" },
                py: 1.5,
                fontWeight: "bold",
                fontFamily: "var(--font-sans)",
              }}
            >
              Login
            </Button>
          </form>
        </Paper>
      )}
    </Box>
  );
}
