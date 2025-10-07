const express = require("express");
const {
  handleCreateNewMenuItem,
  handleRemoveMenuItem,
  handleListMenuItems,
} = require("../../controllers/admin/menu.controller");
const router = express.Router();

module.exports = router;
