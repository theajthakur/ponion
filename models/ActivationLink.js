const mongoose = require("mongoose");

const ActivationLinkSchema = mongoose.Schema(
  {
    activationId: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const ActivationLink = mongoose.model("ActivationLink", ActivationLinkSchema);

module.exports = ActivationLink;
