const mongoose = require("mongoose");
const Cart = require("./Cart");

const ProductSchema = new mongoose.Schema({
    vendorId: { type: String, required: true },
    userEmail: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true, },
    brand: { type: String, trim: true, },
    category: { type: String, trim: true },
    rating: { type: Number, default: 4, },
    reviews: { type: Number, default: 1250, },
    price: { type: Number, required: true, },
    originalPrice: { type: Number, },
    discount: { type: String, },
    description: { type: String, required: true, },
    features: { type: [String], default: [], },
    specifications: { type: Object, default: {}, },
    images: { type: [String], default: [], },
    colors: { type: [String], default: [], },
    sizes: { type: [String], default: [], },
    inStock: { type: Boolean, default: true, },
    uploadDate: { type: Date, default: Date.now, },
});

ProductSchema.pre('findOneAndDelete', async function () {
    try {
        const productId = this.getQuery()._id;
        await Cart.deleteMany({ productId });
    } catch (err) {
        console.error('Error deleting cart items:', err);
        throw err;
    }
});

module.exports = mongoose.model("Product", ProductSchema);
