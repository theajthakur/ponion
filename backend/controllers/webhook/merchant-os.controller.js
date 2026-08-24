const axios = require("axios");
const Order = require("../../models/Order");
const WebhookEvent = require("../../models/WebhookEvent");

const verifyOrder = async (merchant_order_id, event_id) => {
  const verifyUrl = process.env.MERCHANT_OS_VERIFY_URL;
  const webhookKey = process.env.MERCHANT_OS_WEBHOOK_KEY;

  if (!verifyUrl || !webhookKey) {
    console.error("Merchant OS configuration missing. Verification skipped.");
    return;
  }

  try {
    const response = await axios.get(verifyUrl, {
      params: { merchant_order_id },
      headers: {
        Authorization: `Bearer ${webhookKey}`,
      },
    });

    const verifyData = response.data;
    const payment = verifyData.payment || {};
    const data = verifyData.data || {};
    const orderDetails = data.order || {};

    const paymentStatus = payment.status;
    const remoteOrderTotal = orderDetails.order_total;
    const razorpayPaymentId = payment.razorpay_payment_id || payment.id || "unknown";

    // Find the order again to get the latest state
    const order = await Order.findOne({ merchantOrderId: merchant_order_id });
    if (!order) {
      console.error(`Order not found during verification: ${merchant_order_id}`);
      return;
    }

    if (paymentStatus !== "captured") {
      order.status = "failed";
      await order.save();
      console.log(`Order ${merchant_order_id} marked as failed. Payment status: ${paymentStatus}`);
      return;
    }

    // Compare amounts
    if (remoteOrderTotal !== order.price) {
      order.status = "flagged_amount_mismatch";
      await order.save();
      console.error(
        `🚨 ALERT: Amount mismatch for order ${merchant_order_id}! Stored: ${order.price}, Paid: ${remoteOrderTotal}`
      );
      return;
    }

    // Happy Path
    order.status = "confirmed";
    order.razorpayPaymentId = razorpayPaymentId;
    order.confirmedAt = new Date();
    await order.save();

    // Mark event_id as processed to prevent replay attacks / duplicates
    await WebhookEvent.create({ eventId: event_id });
    console.log(`✅ Order ${merchant_order_id} verified and confirmed successfully.`);
  } catch (error) {
    console.error(`Error during Merchant OS verification for order ${merchant_order_id}:`, error.message);
    // Transient error: do not mark as failed, leave as pending
  }
};

const handleWebhook = async (req, res) => {
  try {
    const { event, event_id, merchant_order_id } = req.body;

    // Validate payload
    if (event !== "order.payment_completed" || !event_id || !merchant_order_id) {
      return res.status(400).json({ success: false, message: "Invalid webhook payload" });
    }

    // Check idempotency
    const existingEvent = await WebhookEvent.findOne({ eventId: event_id });
    if (existingEvent) {
      console.log(`Duplicate webhook event ignored: ${event_id}`);
      return res.status(200).json({ success: true, message: "Event already processed" });
    }

    // Check if order exists
    const order = await Order.findOne({ merchantOrderId: merchant_order_id });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // If order is already confirmed, no-op
    if (order.status === "confirmed" || order.status === "Confirmed") {
      return res.status(200).json({ success: true, message: "Order already confirmed" });
    }

    // Respond 200 promptly
    res.status(200).json({ success: true, message: "Processing payment confirmation" });

    // Call verify flow asynchronously (in background)
    // TODO: In production, move this to a message queue/background job (e.g. BullMQ)
    setTimeout(() => {
      verifyOrder(merchant_order_id, event_id);
    }, 0);
  } catch (error) {
    console.error("Webhook receiver error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { handleWebhook, verifyOrder };
