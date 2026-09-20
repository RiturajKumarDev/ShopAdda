const express = require("express");
const cartRouter = express.Router();

const { addToCart, removeFromCart, getCartListProducts } = require("../controllers/cartController");
const { verify_token } = require("../services/authService");

cartRouter.post("/addToCart",verify_token, addToCart);
cartRouter.delete("/removeFromCart",verify_token, removeFromCart);
cartRouter.get("/cartListProducts",verify_token, getCartListProducts);

exports.cartRouter = cartRouter;
