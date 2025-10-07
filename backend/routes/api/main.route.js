const express = require("express");
const {
  fetchActiveRestaurants,
  fetchRestaurantById,
  fetchMenuByRestaurantId,
} = require("../../controllers/api/restaurants.controller");
const router = express.Router();

router.get("/", (req, res) => {
  return res.status(200).json({ status: "success", message: "PONION API v1" });
});
router.get("/restaurants", fetchActiveRestaurants);
router.get("/restaurant/:restaurantId", fetchRestaurantById);
router.get("/restaurant/:restaurantId/menu", fetchMenuByRestaurantId);

module.exports = router;
