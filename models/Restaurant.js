const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  address: String,
  bankDetails: {
    acc_no: {
      type: String,
      required: true,
    },
    ifsc_code: {
      type: String,
      required: true,
    },
  },
  menu: [
    {
      itemName: String,
      price: Number,
      available: { type: Boolean, default: true },
      dietType: {
        type: String,
        enum: ["veg", "egg", "non_veg"],
      },
    },
  ],
});

module.exports = mongoose.model("Restaurant", restaurantSchema);
