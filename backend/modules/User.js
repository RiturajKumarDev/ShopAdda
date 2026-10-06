const mongoose = require("mongoose");

const UserType = {
    ADMIN: "Admin",
    VENDOR: "Vendor",
    CUSTOMER: "Customer",
}

const UserSchema = new mongoose.Schema(
    {
        role: { type: String, required: true },
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        mobile: { type: String, required: true, unique: true },
        dob: { type: String, required: true },
        gender: { type: String, required: true },
        password: { type: String, required: true },
        approved: { type: Boolean, required: true, default: false },
        joinDate: { type: Date, default: Date.now },

        // Business Details
        businessName: String,
        gstNumber: String,
        panNumber: String,
        aadharNumber: String,
        storeAddress: String,
    },
);

module.exports = mongoose.model("User", UserSchema);
