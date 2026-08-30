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
      enum: [
        "Confirmed",
        "Packed",
        "Shipped",
        "Delivered",
        "pending",
        "confirmed",
        "failed",
        "flagged_amount_mismatch",
      ],
      default: "Confirmed",
    },
    merchantOrderId: {
      type: String,
      unique: true,
      sparse: true,
    },
    unitPrice: {
      type: Number,
    },
    couponCode: {
      type: String,
    },
    address: {
      type: mongoose.Schema.Types.Mixed,
    },
    razorpayPaymentId: {
      type: String,
    },
    confirmedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Order", OrderSchema);
