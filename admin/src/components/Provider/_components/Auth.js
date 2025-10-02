import React, { useState } from "react";
import AdminLogin from "./Login";
import RestaurantRegisterForm from "./Register";
import { Box, Button } from "@mui/material";

export default function AuthContainer() {
  const [active, setActive] = useState(true);
  const handleToggle = (value) => {
    setActive(value === "login");
  };
  return (
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
      <Box>
        {" "}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "var(--color-card)",
            borderRadius: 3,
            p: 1,
            width: 300,
            mx: "auto",
            mb: 4,
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <Button
            onClick={() => handleToggle("login")}
            sx={{
              flex: 1,
              borderRadius: 2,
              py: 1.5,
              fontWeight: "bold",
              color:
                active === "login"
                  ? "var(--color-card)"
                  : "var(--color-foreground)",
              backgroundColor:
                active === "login" ? "var(--color-primary)" : "transparent",
              "&:hover": {
                backgroundColor:
                  active === "login"
                    ? "var(--color-primary-hover)"
                    : "var(--color-card)",
              },
              transition: "0.3s",
            }}
          >
            Login
          </Button>
          <Button
            onClick={() => handleToggle("register")}
            sx={{
              flex: 1,
              borderRadius: 2,
              py: 1.5,
              fontWeight: "bold",
              color:
                active === "register"
                  ? "var(--color-card)"
                  : "var(--color-foreground)",
              backgroundColor:
                active === "register" ? "var(--color-primary)" : "transparent",
              "&:hover": {
                backgroundColor:
                  active === "register"
                    ? "var(--color-primary-hover)"
                    : "var(--color-card)",
              },
              transition: "0.3s",
            }}
          >
            Register
          </Button>
        </Box>
        {active ? <AdminLogin /> : <RestaurantRegisterForm />}
      </Box>
    </Box>
  );
}
