const express = require("express");
const paymentRouter = express.Router();

const { createOrder, paymentSuccess } = require("../controllers/paymentController");
const { verify_token } = require("../services/authService");

paymentRouter.post("/success", verify_token, paymentSuccess);
paymentRouter.post("/create-order", verify_token, createOrder);

exports.paymentRouter = paymentRouter;
