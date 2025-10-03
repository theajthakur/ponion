const express = require("express");

const {
  handleAttemptLogin,
  handleNewUser,
  handleNewRestaurantUser,
  verifyUserByEmail,
} = require("../../controllers/auth/auth.controller");
const path = require("path");
const router = express.Router();

const multer = require("multer");
const uploadDir = path.join(__dirname, "public", "uploads");
const upload = multer({ dest: uploadDir });

router.post("/login", handleAttemptLogin);
router.post("/signup", handleNewUser);
router.post(
  "/signup/restaurant",
  upload.single("image"),
  handleNewRestaurantUser
);
router.get("/verify/:verificationId", verifyUserByEmail);

module.exports = router;
