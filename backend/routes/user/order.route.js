const express = require("express");
const { myOrders } = require("../../controllers/user/order.controller");
const router = express.Router();

router.get("/my-orders", myOrders);

module.exports = router;