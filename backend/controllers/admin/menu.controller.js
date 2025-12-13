const Joi = require("joi");
const Restaurant = require("../../models/Restaurant");
const Menu = require("../../models/Menu");
const validateImage = require("../../utils/fileType.utils");
const uploadToCloudinary = require("../../utils/cloudinary.utils");

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
    // -------------------------
    // 1. Validate body
    // -------------------------
    const { error, value } = menuItemSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed!",
        details: error.details.map((d) => d.message),
      });
    }

    // -------------------------
    // 2. Validate image (if provided)
    // -------------------------
    let thumbnail = null;

    if (req.file) {
      const { valid, message } = await validateImage(req.file.buffer);

      if (!valid) {
        return res.status(400).json({
          status: "error",
          message,
        });
      }

      // Upload to Cloudinary
      const result = await uploadToCloudinary(req.file.buffer, {
        folder: 'menu_thumbnails',
        format: 'webp',
      });


      console.log(result);

      thumbnail = result.secure_url;
    }

    // -------------------------
    // 3. Business logic
    // -------------------------
    const { itemName, price, available, dietType } = value;

    const restaurant = await Restaurant.findOne({
      owner: req.user._id,
    });

    if (!restaurant) {
      return res.status(404).json({
        status: "error",
        message: "Restaurant not found for the current user.",
      });
    }

    const count = await Menu.countDocuments({
      restaurantId: restaurant._id,
    });

    if (count >= 10) {
      return res.status(400).json({
        status: "error",
        message: "You can't have more than 10 items on your menu!",
      });
    }

    // -------------------------
    // 4. Save to DB
    // -------------------------
    const newMenuItem = await Menu.create({
      restaurantId: restaurant._id,
      itemName,
      price,
      available,
      dietType,
      thumbnail,
    });

    return res.status(200).json({
      status: "success",
      message: `${itemName} added to your menu!`,
      newMenuItem,
    });

  } catch (error) {
    console.error(error);
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
    if (!itemId)
      return res.status(400).json({
        status: "error",
        message: "Menu item ID is required.",
      });

    const restaurant = await Restaurant.findOne({ owner: req._id });
    if (!restaurant)
      return res.status(404).json({
        status: "error",
        message: "Restaurant not found for the current user.",
      });

    const deletedItem = await Menu.findOneAndDelete({
      _id: itemId,
      restaurantId: restaurant._id,
    });

    if (!deletedItem)
      return res.status(404).json({
        status: "error",
        message: "Menu item not found or already removed.",
      });

    const updatedMenu = await Menu.find({ restaurantId: restaurant._id });

    return res.status(200).json({
      status: "success",
      message: "Item removed successfully!",
      updatedMenu,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "There was a problem while removing the menu item.",
      reason: error.message || "Menu item removal failed",
    });
  }
};

module.exports = {
  handleCreateNewMenuItem,
  handleRemoveMenuItem,
};
