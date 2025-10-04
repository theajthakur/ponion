const express = require("express");
const {
  fetchActiveRestaurants,
  fetchRestaurantById,
} = require("../../controllers/api/restaurants.controller");
const router = express.Router();

router.get("/restaurants", fetchActiveRestaurants);
router.get("/restaurant/:restaurantID", fetchRestaurantById);

module.exports = router;
