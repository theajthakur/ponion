const Razorpay = require("razorpay");
const crypto = require("crypto");
const Menu = require("../../models/Menu");
const Order = require("../../models/Order");
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

const razorpayProceed = async (amount) => {
  try {
    const options = {
      amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const isAvailable = async (cart, req) => {
  const item = await Menu.findOne({ _id: cart._id });
  if (!item) return { status: false, message: "No item available." };
  await Order.create({
    userId: req.user._id,
    menuId: cart._id,
    price: item.price * cart.quantity,
    quantity: cart.quantity,
  });
  return { status: true, item };
};

const handlePlaceOrder = async (req, res) => {
  const { cart = [], coupon } = req.body;

  if (!cart.length)
    return res.json({ status: "success", message: "Nothing is in Cart!" });

  try {
    // Step 1: Check availability for each cart item
    const availabilityChecks = await Promise.all(
      cart.map(async (e) => await isAvailable(e, req))
    );

    // Step 2: Filter only valid items
    const validItems = availabilityChecks
      .map((check, index) => ({
        ...check,
        quantity: cart[index].quantity || 1, // ✅ safely carry quantity
      }))
      .filter((d) => d.status);

    if (!validItems.length)
      return res.json({
        status: "error",
        message: "No valid items available.",
      });

    // Step 3: Calculate total with quantity
    const totalPrice = validItems.reduce(
      (sum, d) => sum + d.item.price * d.quantity,
      0
    );

    console.log("Valid items:", validItems);
    console.log("Total Price:", totalPrice);

    // Step 4: Create Razorpay order
    const order = await razorpayProceed(totalPrice * 100); // Razorpay expects paise

    res.json({
      status: "success",
      order,
      totalPrice,
      message: "Cart verified successfully.",
    });
  } catch (err) {
    console.error("Error in handlePlaceOrder:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

const handleVerifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(sign.toString())
    .digest("hex");

  if (razorpay_signature === expectedSign) {
    res.json({ success: true, message: "Payment verified successfully" });
  } else {
    res.status(400).json({ success: false, message: "Invalid signature" });
  }
};

module.exports = { handlePlaceOrder, handleVerifyPayment };
