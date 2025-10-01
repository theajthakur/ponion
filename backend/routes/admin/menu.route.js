const express = require("express");
const {
  handleListMenuItems,
} = require("../../controllers/admin/menu.controller");
const router = express.Router();

router.get("/list", handleListMenuItems);

module.exports = router;
