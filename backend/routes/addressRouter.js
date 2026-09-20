const express = require("express");
const addressRouter = express.Router();

const { uploadAddress, getAddressList, deleteAddress, updateAddress } = require("../controllers/addressController");
const { verify_token } = require("../services/authService");

addressRouter.post("/uploadAddress", verify_token, uploadAddress);
addressRouter.put("/updateAddress", verify_token, updateAddress);
addressRouter.get("/addresses", verify_token, getAddressList);
addressRouter.delete("/delete", verify_token, deleteAddress);

exports.addressRouter = addressRouter;
