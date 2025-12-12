const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const connectDB = require("./utils/mongo.util");
const app = express();
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.SERVER_PORT || 7000;

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://ponion.vercel.app",
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

connectDB();
const authRoute = require("./routes/auth/auth.route");
app.use("/auth", authRoute);

const {
  checkAuth,
  checkAuthAdmin,
  checkAuthSuperAdmin,
} = require("./middlewares/auth.middleware");

app.use("/api/", require("./routes/api/main.route"));

// Protected Routes for logged in Users
app.use(checkAuth);
const profileRoute = require("./routes/user/profile.route");
const paymentRoute = require("./routes/user/payment.route");
app.use("/user/profile", profileRoute);
app.use("/user/payments", paymentRoute);

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
