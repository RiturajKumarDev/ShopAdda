// const BASE_URL = "http://localhost:3000/api/";
const BASE_URL = "https://shop-adda-backend.vercel.app/api";

export const addToCartServer = async (userId, productId) => {
    const response = await fetch(`${BASE_URL}cart/addToCart`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, productId }),
    });
    return response;
}

export const getCartListToServer = async (userId) => {
    const response = await fetch(`${BASE_URL}cart/cartListProducts/${userId}`);
    return response;
}

export const remeveFromCartServer = async (userId, productId) => {
    const response = await fetch(`${BASE_URL}cart/removeFromCart`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, productId }),
    });
    return response;
}
