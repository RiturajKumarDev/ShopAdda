const express = require("express");
const productRouter = express.Router();

const { uploadProduct, getProduct, getProducts, deleteProduct, updateProduct, getVendorProducts } = require("../controllers/productController");
const { verify_vendor } = require("../services/authService");

productRouter.post("/uploadProduct", verify_vendor, uploadProduct);
productRouter.delete("/deleteProduct/:_id", verify_vendor, deleteProduct);
productRouter.put("/updateProduct/:_id", verify_vendor, updateProduct);
productRouter.get("/getVendorProducts", verify_vendor, getVendorProducts);

productRouter.get("/getProduct/:_id", getProduct);            // done
productRouter.get("/getProducts", getProducts);            // done

exports.productRouter = productRouter;
