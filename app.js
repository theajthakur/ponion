const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const connectDB = require("./utils/mongo.util");
const app = express();
require("dotenv").config();
const PORT = process.env.SERVER_PORT || 7000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

connectDB();

const authRoute = require("./routes/auth/auth.route");
app.use("/auth", authRoute);

app.listen(PORT, () => {
  console.log(`Server started on PORT: http://localhost:${PORT}`);
});
