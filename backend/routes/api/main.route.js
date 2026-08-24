const express = require("express");
const {
  fetchActiveRestaurants,
  fetchRestaurantById,
  fetchMenuByRestaurantId,
} = require("../../controllers/api/restaurants.controller");
const { searchProducts } = require("../../controllers/api/products.controller");
const router = express.Router();

router.get("/", (req, res) => {
  return res.status(200).json({ status: "success", message: "PONION API v1" });
});
router.get("/restaurants", fetchActiveRestaurants);
router.get("/restaurant/:restaurantId", fetchRestaurantById);
router.get("/restaurant/:restaurantId/menu", fetchMenuByRestaurantId);
router.get("/products/search", searchProducts);

module.exports = router;
