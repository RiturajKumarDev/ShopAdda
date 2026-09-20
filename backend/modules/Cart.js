const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            require: true,
            unique: true
        },
        quantity: { type: Number, default: 1 },
        addDate: { type: Date, default: Date.now },
    },
);

module.exports = mongoose.model("Cart", CartSchema);
