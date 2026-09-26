const fs = require("fs");
const Order = require("../modules/Order");
const Cart = require("../modules/Cart");

exports.saveOrder = async (req, res, next) => {
    const userId = req.user._id;
    try {
        const { products, address, paymentMethod } = req.body;
        for (const product of products) {
            const { vendorId, name, brand, category, rating, reviews, price, quantity, originalPrice, discount, description, features, specifications, images, colors, sizes } = product;
            const order = new Order({ vendorId, name, brand, category, rating, reviews, price, quantity, originalPrice, discount, description, features, specifications, images, colors, sizes, userId, address, paymentMethod });
            try {
                const result = await order.save();
            } catch (error) {
            }
        }
        try {
            await Cart.deleteMany({ userId });
        } catch (e) {
        }
        return res.status(201).json({
            success: true,
            message: "Save Order Successfully"
        });
    } catch (error) {
        return res.status(422).json({
            success: false,
            error: error.message
        });
    }
};

exports.orderList = async (req, res, next) => {
    const userId = req.user._id;
    Order.find({ userId })
        .then(orders => {
            res.status(200).json(orders);
        })
        .catch(err => {
            res.status(500).json({ errors: "Server Error" + err.errmsg });
        })
};

exports.getVendorOrders = async (req, res, next) => {
    const vendorId = req.user._id;
    Order.find({ vendorId })
        .sort({ _id: -1 }) // Newest first
        .then(orders => {
            res.status(200).json(orders);
        })
        .catch(err => {
            res.status(500).json({ errors: "Server Error" + err.errmsg });
        })
};

exports.updateOrderStatus = async (req, res, next) => {
    const vendorId = req.user._id;
    const { _id } = req.params;
    const { status } = req.body;
    try {
        const order = await Order.findOneAndUpdate(
            { _id, vendorId },
            { status },
            { new: true }
        );
        if (!order) {
            return res.status(404).json({ errors: "Order not found or unauthorized to edit" });
        }
        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({ errors: "Server Error" + err.message });
    }
};
