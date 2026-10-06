const express = require("express");
const orderRouter = express.Router();

const { saveOrder, orderList, getVendorOrders, updateOrderStatus, getAllOrders } = require("../controllers/orderController");
const { verify_token, verify_vendor, verify_admin } = require("../services/authService");

orderRouter.post("/save-order", verify_token, saveOrder);
orderRouter.get("/orderList", verify_token, orderList);
orderRouter.get("/getVendorOrders", verify_vendor, getVendorOrders);
orderRouter.put("/updateOrderStatus/:_id", verify_vendor, updateOrderStatus);
orderRouter.get("/getAllOrders", verify_admin, getAllOrders);

exports.orderRouter = orderRouter;
