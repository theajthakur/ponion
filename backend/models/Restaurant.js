const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    restaurantId: { type: String, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    address: {
      lat: { type: String, required: true },
      lng: { type: String, required: true },
      raw: { type: String, required: true },
    },
    bankDetails: {
      acc_no: {
        type: String,
      },
      ifsc_code: {
        type: String,
      },
    },
    rating: {
      type: Number,
      default: 0,
    },
    banner: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Restaurant", restaurantSchema);
