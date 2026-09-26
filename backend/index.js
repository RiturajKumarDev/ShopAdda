require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const { default: mongoose } = require("mongoose");

const rootDir = require("./utils/pathUtil");
const { authRouter } = require("./routes/authRouter");
const { productRouter } = require("./routes/productRouter");
const { cartRouter } = require("./routes/cartRouter");
const { addressRouter } = require("./routes/addressRouter");
const { paymentRouter } = require("./routes/paymentRouter");
const { orderRouter } = require("./routes/orderRouter");
const { imageRouter } = require("./routes/imageRouter");
const { vendorRouter } = require("./routes/vendorRouter");
const { verify_token } = require("./services/authService");

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(rootDir, 'public')));
app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

app.use("/api/product", productRouter);
app.use("/api/user", authRouter);
app.use("/api/address", verify_token, addressRouter);
app.use("/api/cart", verify_token, cartRouter);
app.use("/api/payment", verify_token, paymentRouter);
app.use("/api/order", verify_token, orderRouter);
app.use("/api/image", imageRouter);
app.use("/api/vendor", vendorRouter);


app.use((req, res) => {
    res.status(404).json({ "message": "Page not fount!!" });
    // send("<h1 style='text-align:center'>404 Error!!</h1><h2 style='color:red;text-align:center'>Page not found!!</h2>");
});


const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Running server on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.log("Connection error : ", error);
    });
