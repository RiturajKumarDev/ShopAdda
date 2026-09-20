const fs = require("fs");
const Cart = require("../modules/Cart");

exports.addToCart = async (req, res, next) => {
    const { productId } = req.body;
    const userId = req.user._id;
    const cart = new Cart({ userId, productId });
    cart.save()
        .then(result => {
            return res.status(201).json(cart);
        }).catch(error => {
            return res.status(422).json({ "errors": error.errmsg });
        });
};

exports.removeFromCart = async (req, res, next) => {
    const userId = req.user._id;
    const { productId } = req.body;
    Cart.findOneAndDelete({ userId, productId })
        .then(result => {
            return res.status(204).json(result);
        }).catch(error => {
            return res.status(422).json({ "errors": error.errmsg });
        });
};

exports.getCartListProducts = async (req, res, next) => {
    const userId = req.user._id;
    try {
        const cartListProducts = await Cart.find({ userId }).populate("productId");
        res.status(200).json(cartListProducts);
    }
    catch (err) {
        res.status(500).json({ errors: "Server Error" + err.errmsg });
    }
};
