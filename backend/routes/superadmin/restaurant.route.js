const express = require("express");
const {
  handleApproveRestaurent,
} = require("../../controllers/superadmin/restaurant.controller");
const router = express.Router();

router.post("/user/approve", handleApproveRestaurent);

module.exports = router;
