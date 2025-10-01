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
  HomeOutlined,
  PeopleOutline,
  BarChartOutlined,
  SettingsOutlined,
  LogoutOutlined,
  Menu,
} from "@mui/icons-material";
import { useAuth } from "../AuthProvider";

const drawerWidth = 240;

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const { logout } = useAuth();

  const menuItems = [
    { text: "Dashboard", icon: <HomeOutlined />, path: "/dashboard" },
    { text: "Users", icon: <PeopleOutline />, path: "/users" },
    { text: "Analytics", icon: <BarChartOutlined />, path: "/analytics" },
    { text: "Settings", icon: <SettingsOutlined />, path: "/settings" },
  ];

  return (
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
            <ListItemButton>
              <ListItemIcon sx={{ minWidth: 0, justifyContent: "center" }}>
                {item.icon}
              </ListItemIcon>
              {open && <ListItemText primary={item.text} sx={{ ml: 2 }} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List sx={{ mt: "auto" }} onClick={logout}>
        <ListItem button sx={{ px: 2 }}>
          <ListItemIcon sx={{ minWidth: 0, justifyContent: "center" }}>
            <LogoutOutlined />
          </ListItemIcon>
          {open && <ListItemText primary="Logout" sx={{ ml: 2 }} />}
        </ListItem>
      </List>
    </Drawer>
  );
}
