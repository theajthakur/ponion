const express = require("express");
const {
  handlePlaceOrder,
  handleVerifyPayment,
} = require("../../controllers/user/payment.controller");
const router = express.Router();

router.post("/create-order", handlePlaceOrder);
router.post("/verify-payment", handleVerifyPayment);

module.exports = router;
