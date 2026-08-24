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

const mongoose = require("mongoose");

const createMerchantOrder = async (req, res) => {
    try {
        const { cart, product_id, quantity, coupon_code, address, user_id } = req.body;

        // Parse and support both cart list and single product backward compatibility
        const cartItems = [];
        if (cart && Array.isArray(cart)) {
            for (const item of cart) {
                const pid = item.product_id || item._id;
                const qty = item.quantity !== undefined ? item.quantity : 1;
                if (pid) {
                    cartItems.push({ product_id: pid, quantity: qty });
                }
            }
        } else if (product_id) {
            cartItems.push({ product_id, quantity: quantity !== undefined ? quantity : 1 });
        }

        if (cartItems.length === 0) {
            return res.status(400).json({ success: false, message: "cart is required and must not be empty" });
        }

        // Validate quantities and ObjectId format to prevent CastError
        for (const item of cartItems) {
            if (item.quantity === undefined || typeof item.quantity !== "number" || item.quantity <= 0) {
                return res.status(400).json({ success: false, message: "quantity must be a number greater than 0" });
            }
            if (!mongoose.Types.ObjectId.isValid(item.product_id)) {
                return res.status(404).json({ success: false, message: "Product not found" });
            }
        }

        if (!address) {
            return res.status(400).json({ success: false, message: "address is required" });
        }

        const userId = user_id || (req.user && req.user._id);
        if (!userId) {
            return res.status(400).json({ success: false, message: "user_id is required" });
        }

        // Fetch products from database in a single query
        const productIds = cartItems.map(item => item.product_id);
        const products = await Menu.find({ _id: { $in: productIds } });

        const productMap = {};
        for (const p of products) {
            productMap[p._id.toString()] = p;
        }

        // Validate each item exists and is active/in stock
        for (const item of cartItems) {
            const product = productMap[item.product_id.toString()];
            if (!product) {
                return res.status(404).json({ success: false, message: "Product not found" });
            }
            if (product.available === false) {
                return res.status(400).json({ success: false, message: "Product is not available or out of stock" });
            }
            if (product.stock !== undefined && product.stock < item.quantity) {
                return res.status(400).json({ success: false, message: "Product is not available or out of stock" });
            }
        }

        // Generate unique base merchant_order_id
        const merchant_order_id = `ORD-${Date.now()}-${crypto.randomBytes(2).toString("hex").toUpperCase()}`;

        let order_total = 0;
        const orderPromises = [];

        for (let i = 0; i < cartItems.length; i++) {
            const item = cartItems[i];
            const product = productMap[item.product_id.toString()];
            const item_total = product.price * item.quantity;
            order_total += item_total;

            const dbMerchantOrderId = cartItems.length === 1 ? merchant_order_id : `${merchant_order_id}-${i}`;

            orderPromises.push(
                Order.create({
                    userId,
                    menuId: item.product_id,
                    price: item_total,
                    quantity: item.quantity,
                    status: "pending",
                    merchantOrderId: dbMerchantOrderId,
                    unitPrice: product.price,
                    couponCode: coupon_code || undefined,
                    address,
                })
            );
        }

        await Promise.all(orderPromises);

        if (coupon_code) {
            // TODO: real coupon service
        }

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