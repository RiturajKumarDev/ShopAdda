const Razorpay = require("razorpay");
const crypto = require("crypto");

const rpay = new Razorpay({
    key_id: "rzp_test_MDG4kUt9RAa4WG",
    key_secret: "qOeHedQAIynruF8bDSBxsCJN",
});

exports.createOrder = async (req, res, next) => {
    try {
        const { totalPrice } = req.body;

        const order = await rpay.orders.create({
            amount: totalPrice * 100,
            currency: "INR",
        });
        res.status(200).json({ "order": order, "key": "rzp_test_MDG4kUt9RAa4WG" });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

exports.paymentSuccess = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({
            success: false,
            message: "Missing payment details"
        });
    }
    const generatedSignature = crypto
        .createHmac("sha256", "qOeHedQAIynruF8bDSBxsCJN")
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

    if (generatedSignature !== razorpay_signature) {
        return res.status(400).json({
            success: false,
            message: "Invalid Signature"
        });
    }
    return res.status(200).json({
        success: true,
        message: "Payment Verified Successfully"
    });
};
