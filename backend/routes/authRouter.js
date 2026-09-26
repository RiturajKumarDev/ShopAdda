const express = require("express");
const authRouter = express.Router();

const { register, login, getUser, updateUser, changePassword, getAllUsers } = require("../controllers/authController");
const { verify_token, verify_vendor } = require("../services/authService");

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/getUser", verify_token, getUser);
authRouter.put("/update", verify_token, updateUser);
authRouter.put("/change-password", verify_token, changePassword);
authRouter.get("/getAllUsers", verify_vendor, getAllUsers);

exports.authRouter = authRouter;
