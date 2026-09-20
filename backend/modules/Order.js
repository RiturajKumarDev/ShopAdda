const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
    {
        userEmail: { type: String, required: true, trim: true, },
        name: { type: String, required: true, trim: true, },
        brand: { type: String, trim: true, },
        category: { type: String, trim: true },
        rating: { type: Number, default: 4, },
        reviews: { type: Number, default: 1250, },
        price: { type: Number, required: true, },
        quantity: { type: Number, default: 1, },
        originalPrice: { type: Number, },
        discount: { type: String, },
        description: { type: String, required: true, },
        features: { type: [String], default: [], },
        specifications: { type: Object, default: {}, },
        images: { type: [String], default: [], },
        colors: { type: [String], default: [], },
        sizes: { type: [String], default: [], },
        status: { type: String, default: "Pending" },
        paymentMethod: { type: String, default: "Cash On Delivery", },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        address: {},
        orderDate: { type: Date, default: Date.now },
        deliveryDate: {
            type: Date,
            default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
    },
);

module.exports = mongoose.model("Order", OrderSchema);
