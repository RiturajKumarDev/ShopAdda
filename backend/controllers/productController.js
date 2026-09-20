const fs = require("fs");
const Product = require("../modules/Product");

exports.uploadProduct = async (req, res, next) => {
    const { userEmail, name, brand, rating, reviews, price, originalPrice, discount, description, features, specifications, images, colors, sizes, inStock } = req.body;
    const product = new Product({ userEmail, name, brand, rating, reviews, price, originalPrice, discount, description, features, specifications, images, colors, sizes, inStock });
    if (userEmail.toLowerCase() === 'riturajkumar1105@gmail.com') {
        product.save()
            .then(result => {
                return res.status(201).json(product);
            }).catch(error => {
                return res.status(422).json({ "errors": error.errmsg });
            });
    } else
        return res.status(403).json({ "errors": "You cannot access this!!" });
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
