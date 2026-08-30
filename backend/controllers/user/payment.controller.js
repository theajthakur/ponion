const Razorpay = require("razorpay");
const crypto = require("crypto");
const mongoose = require("mongoose");
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
    return { success: true, order };
  } catch (error) {
    console.error("Razorpay Order Creation Error:", error);
    const errorMsg =
      error?.error?.description || error?.message || "Authentication failed";
    return { success: false, error: errorMsg };
  }
};

const Address = require("../../models/Address");

const isAvailable = async (cart, req, addressSnapshot) => {
  const item = await Menu.findOne({ _id: cart._id });
  if (!item) return { status: false, message: "No item available." };
  await Order.create({
    userId: req.user._id || req.user.id,
    menuId: cart._id,
    price: item.price * cart.quantity,
    quantity: cart.quantity,
    address: addressSnapshot,
  });
  return { status: true, item };
};

const handlePlaceOrder = async (req, res) => {
  const { cart = [], coupon, addressId, address_id, address } = req.body;

  if (!cart.length)
    return res.json({ status: "success", message: "Nothing is in Cart!" });

  try {
    const userId = req.user && (req.user._id || req.user.id);
    const targetAddressId = addressId || address_id;
    let addressSnapshot = null;

    if (targetAddressId && mongoose.Types.ObjectId.isValid(targetAddressId)) {
      try {
        const addressDoc = await Address.findOne({ _id: targetAddressId, userId });
        if (addressDoc && String(addressDoc.userId) === String(userId)) {
          addressSnapshot = {
            addressId: addressDoc._id,
            label: addressDoc.label,
            flatNo: addressDoc.flatNo,
            street: addressDoc.street,
            landmark: addressDoc.landmark,
            city: addressDoc.city,
            district: addressDoc.district,
            state: addressDoc.state,
            pincode: addressDoc.pincode,
            country: addressDoc.country,
          };
        }
      } catch (err) {
        addressSnapshot = null;
      }
    }

    if (!addressSnapshot && address) {
      if (typeof address === "object") {
        addressSnapshot = {
          addressId: targetAddressId || address._id || address.id,
          name: address.Name || address.name,
          mobile: address.Mobile || address.mobile,
          flatNo: address.Flat || address.flatNo || address.flat,
          street: address.Area || address.street || address.address,
          landmark: address.Landmark || address.landmark,
          city: address.City || address.city || address.District || address.district,
          district: address.District || address.district,
          state: address.State || address.state,
          pincode: address.PinCode || address.pincode || address.pinCode,
          country: address.Country || address.country || "India",
        };
      } else if (typeof address === "string") {
        addressSnapshot = address;
      }
    }

    if (!addressSnapshot) {
      return res.status(400).json({
        success: false,
        error: "INVALID_ADDRESS",
        message: "Address not found for this user",
      });
    }

    // Step 1: Check availability for each cart item
    const availabilityChecks = await Promise.all(
      cart.map(async (e) => await isAvailable(e, req, addressSnapshot))
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
    const razorpayResult = await razorpayProceed(totalPrice * 100); // Razorpay expects paise

    if (!razorpayResult.success) {
      return res.status(500).json({
        status: "error",
        success: false,
        message: `Razorpay Error: ${razorpayResult.error}. Please check your Key ID and Key Secret in backend .env file.`,
      });
    }

    res.json({
      status: "success",
      success: true,
      order: razorpayResult.order,
      totalPrice,
      message: "Order created successfully.",
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

module.exports = { handlePlaceOrder, handleVerifyPayment, razorpay };
