const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      default: "user",
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },
    status: {
      type: String,
      enum: ["active", "disabled", "pending_email"],
      default: "pending_email",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
