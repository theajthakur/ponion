const express = require("express");
const { myOrders, getOrderById, createMerchantOrder } = require("../../controllers/user/order.controller");
const router = express.Router();

router.get("/my-orders", myOrders);
router.get("/order/:orderId", getOrderById);
router.post("/order/merchant-os", createMerchantOrder);

module.exports = router;