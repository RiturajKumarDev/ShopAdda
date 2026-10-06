const express = require("express");
const authRouter = express.Router();

const { register, login, getUser, updateUser, changePassword, getAllUsers, deleteUser, updateUserByAdmin } = require("../controllers/authController");
const { verify_token, verify_admin, verify_vendor_or_admin } = require("../services/authService");

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/getUser", verify_token, getUser);
authRouter.put("/update", verify_token, updateUser);
authRouter.put("/change-password", verify_token, changePassword);
authRouter.get("/getAllUsers", verify_vendor_or_admin, getAllUsers);
authRouter.delete("/deleteUser/:id", verify_admin, deleteUser);
authRouter.put("/admin-update-user/:id", verify_admin, updateUserByAdmin);

exports.authRouter = authRouter;
