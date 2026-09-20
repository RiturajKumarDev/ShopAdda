const express = require("express");
const authRouter = express.Router();

const { register, login, getUser, updateUser, changePassword } = require("../controllers/authController");
const { verify_token } = require("../services/authService");

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/getUser", verify_token, getUser);
authRouter.put("/update", verify_token, updateUser);
authRouter.put("/change-password", verify_token, changePassword);

exports.authRouter = authRouter;
