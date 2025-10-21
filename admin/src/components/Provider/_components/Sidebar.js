"use client";
import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Toolbar,
  Divider,
  Typography,
  ListItemButton,
} from "@mui/material";
import {
  RestaurantMenuOutlined,
  DashboardOutlined,
  StorefrontOutlined,
  PeopleOutline,
  ShoppingCartOutlined,
  BarChartOutlined,
  LocalOfferOutlined,
  SettingsOutlined,
  PersonOutlined,
  Menu,
  LogoutOutlined,
} from "@mui/icons-material";
import { useAuth } from "../AuthProvider";
import { useRouter } from "next/navigation";

import { motion } from "framer-motion";

const drawerWidth = 240;

export default function Sidebar() {
  const router = useRouter();

  const [open, setOpen] = useState(true);
  const { user, logout } = useAuth();

  const globalItems = [
    {
      text: "Dashboard",
      icon: <DashboardOutlined />,
      path: "/",
      role: ["admin", "superadmin"],
    },
    {
      text: "Orders",
      icon: <ShoppingCartOutlined />,
      path: "/orders",
      role: ["admin"],
    },
    {
      text: "Menu",
      icon: <RestaurantMenuOutlined />,
      path: "/menu",
      role: ["admin"],
    },
    {
      text: "Users",
      icon: <PeopleOutline />,
      path: "/users",
      role: ["superadmin"],
    },
    {
      text: "Restaurants",
      icon: <StorefrontOutlined />,
      path: "/restaurants",
      role: ["superadmin"],
    },
    {
      text: "Analytics",
      icon: <BarChartOutlined />,
      path: "/analytics",
      role: ["admin", "superadmin"],
    },
    {
      text: "Discounts",
      icon: <LocalOfferOutlined />,
      path: "/promotions",
      role: ["admin", "superadmin"],
    },
    {
      text: "Settings",
      icon: <SettingsOutlined />,
      path: "/settings",
      role: ["superadmin"],
    },
    {
      text: "Profile",
      icon: <PersonOutlined />,
      path: "/profile",
      role: ["admin", "superadmin"],
    },
  ];
  let menuItems = globalItems.filter((g) => g.role.includes(user.role));

  return (
    <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? drawerWidth : 60,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? drawerWidth : 60,
            boxSizing: "border-box",
            transition: "width 0.3s",
            backgroundColor: user?.role == "superadmin" ? "#ffedaf" : "",
          },
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: open ? "space-between" : "center",
            px: 2,
          }}
        >
          {open && (
            <Typography variant="h6" className=" whitespace-nowrap">
              Admin Panel
            </Typography>
          )}
          <IconButton onClick={() => setOpen(!open)}>
            <Menu />
          </IconButton>
        </Toolbar>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem disablePadding key={item.text} sx={{ px: 2 }}>
              <ListItemButton
                onClick={() => {
                  router.push(item.path);
                }}
                sx={{
                  display: "flex",
                  justifyContent: open ? "flex-start" : "center",
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {open && <ListItemText primary={item.text} sx={{ ml: 2 }} />}
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider />
        <List sx={{ mt: "auto" }} onClick={logout}>
          <ListItem sx={{ px: 2 }}>
            <ListItemButton>
              <ListItemIcon sx={{ minWidth: 0, justifyContent: "center" }}>
                <LogoutOutlined />
              </ListItemIcon>
              {open && <ListItemText primary="Logout" sx={{ ml: 2 }} />}
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </motion.div>
  );
}
