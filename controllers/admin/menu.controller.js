const Joi = require("joi");
const Restaurant = require("../../models/Restaurant");

const allowedDietType = ["veg", "egg", "non_veg"];

const menuItemSchema = Joi.object({
  itemName: Joi.string().trim().required(),
  price: Joi.number().integer().positive().required(),
  available: Joi.boolean().optional().default(true),
  dietType: Joi.string()
    .valid(...allowedDietType)
    .required(),
});

const handleCreateNewMenuItem = async (req, res) => {
  try {
    // ✅ Validate request body
    const { error, value } = menuItemSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed!",
        details: error.details.map((detail) => detail.message),
      });
    }

    const { itemName, price, available, dietType } = value;

    // ✅ Find the restaurant by owner ID
    const restaurant = await Restaurant.findOne({ owner: req._id });

    if (!restaurant) {
      return res.status(404).json({
        status: "error",
        message: "Restaurant not found for the current user.",
      });
    }

    // ✅ Check if menu has reached the limit
    if (restaurant.menu.length >= 10) {
      return res.status(400).json({
        status: "error",
        message: "You can't have more than 10 items on your menu!",
      });
    }

    // ✅ Add the new menu item
    const updatedRestaurant = await Restaurant.findOneAndUpdate(
      { owner: req._id },
      {
        $push: {
          menu: { itemName, price, available, dietType },
        },
      },
      { new: true }
    );

    return res.status(200).json({
      status: "success",
      message: `${itemName} added to your menu!`,
      updatedMenu: updatedRestaurant.menu,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message:
        "There was a problem while updating the menu, please try again later.",
      reason: error.message || "Menu update failed",
    });
  }
};

const handleRemoveMenuItem = async (req, res) => {
  try {
    const { itemId } = req.body;
    if (!itemId) {
      return res.status(400).json({
        status: "error",
        message: "Menu item ID is required.",
      });
    }

    const updatedRestaurant = await Restaurant.findOneAndUpdate(
      { owner: req._id },
      { $pull: { menu: { _id: itemId } } },
      { new: true }
    );

    if (!updatedRestaurant) {
      return res.status(404).json({
        status: "error",
        message: "Restaurant not found for the current user.",
      });
    }

    const itemExists = updatedRestaurant.menu.some(
      (item) => item._id.toString() === itemId
    );

    if (itemExists) {
      return res.status(400).json({
        status: "error",
        message: "Item could not be removed.",
      });
    }

    return res.status(200).json({
      status: "success",
      message: `Item removed successfully!`,
      updatedMenu: updatedRestaurant.menu,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "There was a problem while removing the menu item.",
      reason: error.message || "Menu item removal failed",
    });
  }
};

const handleListMenuItems = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req._id });
    return res.json({
      status: "success",
      message: "menu fetched successfully",
      restaurant,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: "error",
      message: "failed to fetch menu items!",
    });
  }
};

module.exports = {
  handleRemoveMenuItem,
  handleRemoveMenuItem,
  handleListMenuItems,
};
