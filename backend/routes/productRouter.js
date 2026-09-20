const express = require("express");
const productRouter = express.Router();

const { uploadProduct, getProduct, getProducts } = require("../controllers/productController");
const { verify_vendor } = require("../services/authService");

productRouter.post("/uploadProduct", verify_vendor, uploadProduct);
productRouter.get("/getProduct/:_id", getProduct);
productRouter.get("/getProducts", getProducts);

exports.productRouter = productRouter;
