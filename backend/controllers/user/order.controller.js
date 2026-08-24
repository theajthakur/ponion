const Order = require("../../models/Order");
const Menu = require("../../models/Menu");
const crypto = require("crypto");

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

const createMerchantOrder = async (req, res) => {
    try {
        const { product_id, quantity, coupon_code, address, user_id } = req.body;

        if (!product_id) {
            return res.status(400).json({ success: false, message: "product_id is required" });
        }
        if (quantity === undefined || typeof quantity !== "number" || quantity <= 0) {
            return res.status(400).json({ success: false, message: "quantity must be a number greater than 0" });
        }
        if (!address) {
            return res.status(400).json({ success: false, message: "address is required" });
        }

        const userId = user_id || (req.user && req.user._id);
        if (!userId) {
            return res.status(400).json({ success: false, message: "user_id is required" });
        }

        const product = await Menu.findById(product_id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        if (product.available === false || (product.stock !== undefined && product.stock < quantity)) {
            return res.status(400).json({ success: false, message: "Product is not available or out of stock" });
        }

        // Calculate total price using database product price as source of truth
        const order_total = product.price * quantity;

        if (coupon_code) {
            // TODO: real coupon service
        }

        // Generate unique merchant_order_id
        const merchant_order_id = `ORD-${Date.now()}-${crypto.randomBytes(2).toString("hex").toUpperCase()}`;

        await Order.create({
            userId,
            menuId: product_id,
            price: order_total,
            quantity,
            status: "pending",
            merchantOrderId: merchant_order_id,
            unitPrice: product.price,
            couponCode: coupon_code || undefined,
            address,
        });

        return res.status(201).json({
            success: true,
            merchant_order_id,
            status: "pending",
            order_total,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { myOrders, getOrderById, createMerchantOrder };