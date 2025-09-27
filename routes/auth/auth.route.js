const express = require("express");

const {
  handleAttemptLogin,
  handleNewUser,
  handleNewRestaurantUser,
} = require("../../controllers/auth/auth.controller");
const router = express.Router();

router.post("/login", handleAttemptLogin);
router.post("/signup", handleNewUser);
router.post("/signup/restaurant", handleNewRestaurantUser);

module.exports = router;
