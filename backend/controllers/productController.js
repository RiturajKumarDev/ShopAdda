const fs = require("fs");
const Product = require("../modules/Product");

exports.uploadProduct = async (req, res, next) => {
    const vendorId = req.user._id;
    const { name, brand, category, rating, reviews, price, originalPrice, discount, description, features, specifications, images, colors, sizes, inStock } = req.body;
    const product = new Product({ vendorId, name, brand, category, rating, reviews, price, originalPrice, discount, description, features, specifications, images, colors, sizes, inStock });
    product.save()
        .then(result => {
            return res.status(201).json(product);
        }).catch(error => {
            return res.status(422).json({ "errors": error.errmsg });
        });
};

exports.getProduct = async (req, res, next) => {
    const { _id } = req.params;
    try {
        const product = await Product.findById(_id);
        res.status(200).json(product);
    }
    catch (err) {
        res.status(500).json({ errors: "Server Error" + err.errmsg });
    }
};

exports.getProducts = async (req, res, next) => {
    Product.find()
        .then((products) => {
            res.status(200).json(products);
        })
        .catch((error) => {
            res.status(422).json({ "errors": error.errmsg });
        })
};

exports.getVendorProducts = async (req, res, next) => {
    const vendorId = req.user._id;
    Product.find({ vendorId: vendorId })
        .then((products) => {
            res.status(200).json(products);
        })
        .catch((error) => {
            res.status(422).json({ "errors": error.errmsg });
        })
};

exports.deleteProduct = async (req, res, next) => {
    const { _id } = req.params;
    try {
        const product = await Product.findOneAndDelete({ _id: _id, vendorId: req.user._id });
        if (!product) {
            return res.status(404).json({ errors: "Product not found or unauthorized to delete" });
        }
        res.status(200).json({ errors: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ errors: "Server Error: " + err.message });
    }
};

exports.updateProduct = async (req, res, next) => {
    const { _id } = req.params;
    try {
        const product = await Product.findOneAndUpdate(
            { _id: _id, vendorId: req.user._id },
            req.body,
            { new: true }
        );
        if (!product) {
            return res.status(404).json({ errors: "Product not found or unauthorized to edit" });
        }
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ errors: "Server Error: " + err.message });
    }
};
