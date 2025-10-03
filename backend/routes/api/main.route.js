const express = require("express");
const {
  fetchActiveRestaurants,
} = require("../../controllers/api/restaurants.controller");
const router = express.Router();

router.get("/restaurants", fetchActiveRestaurants);

module.exports = router;
