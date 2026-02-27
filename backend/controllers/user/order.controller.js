const Order = require("../../models/Order");

const myOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id }).populate("menuId");
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId).populate("menuId");
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        return res.status(200).json({ success: true, order });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { myOrders, getOrderById };