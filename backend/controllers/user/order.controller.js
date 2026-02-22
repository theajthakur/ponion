const Order = require("../../models/Order");

const myOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id }).populate("menuId");
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = { myOrders };