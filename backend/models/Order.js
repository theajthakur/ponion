const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    menuId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Menu",
      required: true,
    },
    price: { type: Number, required: 0 },
    quantity: { type: Number, default: 1 },
    status: {
      type: String,
      enum: ["Confirmed", "Packed", "Shipped", "Delivered"],
      default: "Confirmed",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Order", OrderSchema);
