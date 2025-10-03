const express = require("express");
const {
  fetchAllRestaurants,
} = require("../../controllers/superadmin/restaurant.controller");
const router = express.Router();

router.get("/restaurants", fetchAllRestaurants);

module.exports = router;
