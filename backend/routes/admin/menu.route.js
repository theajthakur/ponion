const express = require("express");
const {
  handleCreateNewMenuItem,
  handleRemoveMenuItem,
  handleListMenuItems,
} = require("../../controllers/admin/menu.controller");
const router = express.Router();

router.get("/list", handleListMenuItems);

module.exports = router;
