const express = require("express");
const analyticsRouter = express.Router();
const { getAnalytics } = require("../controllers/analyticsController");
const { verify_admin } = require("../services/authService");

analyticsRouter.get("/dashboard", verify_admin, getAnalytics);

exports.analyticsRouter = analyticsRouter;
