const express = require("express");
const {
  handlePlaceOrder,
  handleVerifyPayment,
  getOrderAmountByMerchantOrderId,
} = require("../../controllers/user/payment.controller");
const router = express.Router();

router.post("/create-order", handlePlaceOrder);
router.post("/verify-payment", handleVerifyPayment);
router.get("/order-amount/:merchantOrderId", getOrderAmountByMerchantOrderId);
router.get("/order-amount", getOrderAmountByMerchantOrderId);

module.exports = router;
