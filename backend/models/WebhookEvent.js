const mongoose = require("mongoose");

const WebhookEventSchema = mongoose.Schema(
  {
    eventId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("WebhookEvent", WebhookEventSchema);
