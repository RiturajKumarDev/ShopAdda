const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        alternatePhone: String,
        addressLine1: { type: String, required: true },
        addressLine2: String,
        landmark: String,
        city: String,
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        country: { type: String, required: true, default: 'India' },
        addressType: { type: String, default: 'Home' },
        isDefault: { type: String, default: true },
    },
);

module.exports = mongoose.model("Address", AddressSchema);
