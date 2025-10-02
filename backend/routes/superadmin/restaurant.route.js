const express = require("express");
const {
  handleApproveRestaurent,
  fetchAllRestaurants,
} = require("../../controllers/superadmin/restaurant.controller");
const router = express.Router();
router.get("/restaurants", fetchAllRestaurants);
router.post("/user/approve", handleApproveRestaurent);

module.exports = router;
