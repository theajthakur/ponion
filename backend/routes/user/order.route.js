const express = require("express");
const { myOrders, getOrderById } = require("../../controllers/user/order.controller");
const router = express.Router();

router.get("/my-orders", myOrders);
router.get("/order/:orderId", getOrderById);

module.exports = router;