const Menu = require("../../models/Menu");
const Restaurant = require("../../models/Restaurant");

const fetchActiveRestaurants = async (req, res) => {
  try {
    const restaurantsDirect = await Restaurant.find({}).populate(
      "owner",
      "name status role"
    );

    if (!restaurantsDirect || restaurantsDirect.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No restaurants found",
      });
    }

    const restaurants = restaurantsDirect.filter(
      (r) => r.owner?.status === "active"
    );

    return res.status(200).json({
      status: "success",
      message: `${restaurants.length} restaurants fetched successfully`,
      restaurants,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "An error occurred while fetching restaurants",
      error: error.message,
    });
  }
};

const fetchRestaurantById = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    if (!restaurantId) {
      return res.status(400).json({
        status: "error",
        message: "Restaurant ID is required",
      });
    }

    const restaurant = await Restaurant.findOne({ restaurantId }).populate(
      "owner",
      "name status role"
    );

    if (!restaurant) {
      return res.status(404).json({
        status: "error",
        message: "Restaurant not found",
      });
    }

    if (restaurant.owner.status !== "active") {
      return res.status(400).json({
        status: "error",
        message: "Restaurant is not verified",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Restaurant fetched successfully",
      restaurant,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "An error occurred while fetching the restaurant",
      error: error.message,
    });
  }
};

const fetchMenuByRestaurantId = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    if (!restaurantId) {
      return res.status(400).json({
        status: "error",
        message: "Restaurant ID is required",
      });
    }

    const restaurant = await Restaurant.findOne({ restaurantId }).populate(
      "owner",
      "name status role"
    );

    if (!restaurant) {
      return res.status(404).json({
        status: "error",
        message: "Restaurant not found",
      });
    }

    if (restaurant.owner.status !== "active") {
      return res.status(400).json({
        status: "error",
        message: "Restaurant is not verified",
      });
    }

    const menuItems = await Menu.find({ restaurantId: restaurant._id });

    return res.status(200).json({
      status: "success",
      message: `${menuItems.length} items from menu fetched successfully`,
      restaurant,
      menuItems,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "An error occurred while fetching the restaurant",
      error: error.message,
    });
  }
};

module.exports = {
  fetchActiveRestaurants,
  fetchRestaurantById,
  fetchMenuByRestaurantId,
};
