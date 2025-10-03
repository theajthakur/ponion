const mongoose = require("mongoose");
const User = require("../../models/User");
const Restaurant = require("../../models/Restaurant");

const handleApproveRestaurent = async (req, res) => {
  try {
    const { ownerId } = req.body;

    if (!ownerId) {
      return res.status(400).json({
        status: "error",
        message: "ownerId is required.",
      });
    }

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(ownerId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid ownerId format.",
      });
    }

    const user = await User.findById(ownerId);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "No user found with the given ownerId.",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Invalid role! Only admins can be approved.",
      });
    }

    if (user.status === "active") {
      return res.status(200).json({
        status: "info",
        message: "Restaurant is already active.",
      });
    }

    user.status = "active";
    await user.save();

    return res.status(200).json({
      status: "success",
      message: "Restaurant activated successfully!",
    });
  } catch (err) {
    console.error("Error approving restaurant:", err.message || err);

    return res.status(500).json({
      status: "error",
      message: "Internal server error.",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

const fetchAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({}).populate(
      "owner",
      "name status role"
    );
    return res.status(200).json({
      status: "success",
      message: `${restaurants.length} restaurant fetched successfully!`,
      restaurants,
    });
  } catch (error) {
    return res.json({ status: "error", message: "No restaurant found!" });
  }
};

module.exports = { handleApproveRestaurent, fetchAllRestaurants };
