const express = require("express");
const { getDashboardStats } = require("../controllers/vendorController");
const { verify_vendor } = require("../services/authService");

const vendorRouter = express.Router();

vendorRouter.get("/dashboard-stats", verify_vendor, getDashboardStats);

module.exports = { vendorRouter };
