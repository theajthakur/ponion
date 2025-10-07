const mongoose = require("mongoose");

const MenuSchema = mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    itemName: { type: String, required: true },
    price: { type: Number, required: true },
    available: { type: Boolean, default: true },
    thumbnail: { type: String },
    dietType: {
      type: String,
      enum: ["veg", "egg", "non_veg"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Menu", MenuSchema);
