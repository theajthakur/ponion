const express = require("express");
const {
  handleShowUserProfile,
} = require("../../controllers/user/profile.controller");
const router = express.Router();

router.get("/", handleShowUserProfile);

module.exports = router;
