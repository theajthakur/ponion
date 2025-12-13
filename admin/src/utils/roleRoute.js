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
} from "@mui/icons-material";
export const globalItems = [
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
  // {
  //   text: "Analytics",
  //   icon: <BarChartOutlined />,
  //   path: "/analytics",
  //   role: ["admin", "superadmin"],
  // },
  // {
  //   text: "Discounts",
  //   icon: <LocalOfferOutlined />,
  //   path: "/promotions",
  //   role: ["admin", "superadmin"],
  // },
  // {
  //   text: "Settings",
  //   icon: <SettingsOutlined />,
  //   path: "/settings",
  //   role: ["superadmin"],
  // },
  {
    text: "Profile",
    icon: <PersonOutlined />,
    path: "/profile",
    role: ["admin", "superadmin"],
  },
];
