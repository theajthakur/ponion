const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const connectDB = require("./utils/mongo.util");
const app = express();
require("dotenv").config();
const PORT = process.env.SERVER_PORT || 7000;

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

connectDB();

const authRoute = require("./routes/auth/auth.route");
app.use("/auth", authRoute);

const {
  checkAuth,
  checkAuthAdmin,
  checkAuthSuperAdmin,
} = require("./middlewares/auth.middleware");

// Protected Routes for logged in Users
app.use(checkAuth);
const profileRoute = require("./routes/user/profile.route");
app.use("/user/profile", profileRoute);

// Protected Routes for Admins Only
app.use(checkAuthAdmin);
const menuRoute = require("./routes/admin/menu.route");
app.use("/admin", menuRoute);

// Protected Routes for SuperAdmins Only
app.use(checkAuthSuperAdmin);
const restaurantRoutes = require("./routes/superadmin/restaurant.route");
app.use("/superadmin", restaurantRoutes);

app.listen(PORT, () => {
  console.log(`Server started on PORT: http://localhost:${PORT}`);
});
