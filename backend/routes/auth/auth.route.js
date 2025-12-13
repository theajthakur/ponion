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

// Memory storage keeps file in req.file.buffer
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

router.post("/login", handleAttemptLogin);
router.post("/signup", handleNewUser);
router.post(
  "/signup/restaurant",
  upload.single("image"),
  handleNewRestaurantUser
);
router.get("/verify/:verificationId", verifyUserByEmail);

module.exports = router;
