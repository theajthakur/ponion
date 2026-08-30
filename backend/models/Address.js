const mongoose = require("mongoose");

const AddressSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    label: {
      type: String,
      trim: true,
    },
    flatNo: {
      type: String,
      required: [true, "flatNo is required"],
      trim: true,
    },
    street: {
      type: String,
      required: [true, "street is required"],
      trim: true,
    },
    landmark: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      required: [true, "city is required"],
      trim: true,
    },
    district: {
      type: String,
      required: [true, "district is required"],
      trim: true,
    },
    state: {
      type: String,
      required: [true, "state is required"],
      trim: true,
    },
    pincode: {
      type: String,
      required: [true, "pincode is required"],
      trim: true,
      match: [/^[1-9][0-9]{5}$/, "Invalid pincode format"],
    },
    country: {
      type: String,
      default: "India",
      trim: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

AddressSchema.index({ userId: 1, isDefault: -1 });

module.exports = mongoose.model("Address", AddressSchema);
