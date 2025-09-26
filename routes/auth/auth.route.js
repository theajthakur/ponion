const express = require("express");
const { status } = require("express/lib/response");
const {
  handleAttemptLogin,
  handleNewUser,
} = require("../../controllers/auth/auth.controller");
const router = express.Router();

router.post("/login", handleAttemptLogin);
router.post("/signup", handleNewUser);

module.exports = router;
