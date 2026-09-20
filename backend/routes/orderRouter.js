const express = require("express");
const orderRouter = express.Router();

const { saveOrder, orderList } = require("../controllers/orderController");
const { verify_token } = require("../services/authService");

orderRouter.post("/save-order", verify_token, saveOrder);
orderRouter.get("/orderList", verify_token, orderList);

exports.orderRouter = orderRouter;
