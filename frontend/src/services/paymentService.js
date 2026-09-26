import { getToken } from './authService';

const BASE_URL = import.meta.env.VITE_BASE_URL;
export const createOrder = async (products) => {
    let totalPrice = 0;
    products.forEach(product => {
        totalPrice = totalPrice + product.price * (product.quantity ? product.quantity : 1);
    });
    const response = await fetch(`${BASE_URL}payment/create-order`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ totalPrice }),
    });
    return response;
};

export const makePayment = async (products, address, onSuccess) => {
    const response = await createOrder(products);
    const res = await response.json();
    var options = {
        key: res['key'],
        amount: res.order['amount'],
        currency: "INR",
        name: "Buying stuff",
        description: "Purchase things",
        orderId: "Product OrderId",
        order_id: res.order['id'],
        image: "https://shop-adda-pi.vercel.app/shopAdda.png",

        notes: {
            products: products
        },

        method: {
            upi: true,
            card: true,
            netbanking: true,
            wallet: true
        },

        handler: async function (response) {
            fetch(`${BASE_URL}payment/success`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    amount: res.order['amount'],
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature
                })
            })
                .then(async (res) => {
                    const order = { products: products, address: address, paymentMethod: "Online" };
                    if (res.ok) {
                        try {
                            const response = await fetch(`${BASE_URL}order/save-order`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": getToken(),
                                },
                                body: JSON.stringify(order),
                            });
                            
                            const data = await response.json();
                            if (response.ok) {
                                if (onSuccess) onSuccess();
                            } else {
                                alert(data.error || "Failed to save order");
                            }
                        } catch (err) {
                            alert("Error: " + err.message);
                        }
                    } else {
                        alert("Server verification failed");
                    }
                })
                .catch(err => alert(err.message));
        },

        theme: {
            color: "#667eea"
        }
    };
    return options;
}
