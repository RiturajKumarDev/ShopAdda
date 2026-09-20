import { getToken } from './authService';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const addToCartServer = async (productId) => {
    const response = await fetch(`${BASE_URL}cart/addToCart`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": getToken(),
        },
        body: JSON.stringify({ productId }),
    });
    return response;
}

export const getCartListToServer = async () => {
    const response = await fetch(`${BASE_URL}cart/cartListProducts`, {
        method: "GET",
        headers: {
            "Authorization": getToken(),
        },
    });
    return response;
}

export const remeveFromCartServer = async (productId) => {
    const response = await fetch(`${BASE_URL}cart/removeFromCart`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": getToken(),
        },
        body: JSON.stringify({ productId }),
    });
    return response;
}
