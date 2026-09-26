import Cookies from "js-cookie";
import { getToken } from "./authService";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const uploadProductToServer = async (product) => {
    const response = await fetch(`${BASE_URL}product/uploadProduct`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": getToken(),
        },
        body: JSON.stringify(product),
    });
    return response;
}

export const getProductsToserver = async () => {
    const response = await fetch(`${BASE_URL}product/getProducts`);
    return response;
}

export const getVendorProductsFromServer = async () => {
    const response = await fetch(`${BASE_URL}product/getVendorProducts`, {
        method: "GET",
        headers: {
            "Authorization": getToken(),
        },
    });
    return response;
}

export const deleteProductFromServer = async (productId) => {
    const response = await fetch(`${BASE_URL}product/deleteProduct/${productId}`, {
        method: "DELETE",
        headers: {
            "Authorization": getToken(),
        },
    });
    return response;
}

export const updateProductToServer = async (productId, productData) => {
    const response = await fetch(`${BASE_URL}product/updateProduct/${productId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": getToken(),
        },
        body: JSON.stringify(productData),
    });
    return response;
}
