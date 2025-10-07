const express = require("express");
const {
  handleApproveRestaurent,
  fetchAllRestaurants,
  getRestaurantDetails,
  getAllUsers,
} = require("../../controllers/superadmin/restaurant.controller");

const router = express.Router();
router.get("/restaurants", fetchAllRestaurants);
router.post("/user/approve", handleApproveRestaurent);
router.get("/users", getAllUsers);
router.get("/restaurant/:restaurantId", getRestaurantDetails);

module.exports = router;
