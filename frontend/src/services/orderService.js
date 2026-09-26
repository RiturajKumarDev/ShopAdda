import { getToken } from './authService';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getOderListToServer = async () => {
    const response = await fetch(`${BASE_URL}order/orderList`, {
        method: "GET",
        headers: {
            "Authorization": getToken(),
        },
    });
    return response;
}

export const saveOrderToServer = async (orderData) => {
    const response = await fetch(`${BASE_URL}order/save-order`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": getToken(),
        },
        body: JSON.stringify(orderData),
    });
    return response;
}

export const getVendorOrdersFromServer = async () => {
    const response = await fetch(`${BASE_URL}order/getVendorOrders`, {
        method: "GET",
        headers: {
            "Authorization": getToken(),
        },
    });
    return response;
}

export const updateOrderStatusToServer = async (orderId, status) => {
    const response = await fetch(`${BASE_URL}order/updateOrderStatus/${orderId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": getToken(),
        },
        body: JSON.stringify({ status }),
    });
    return response;
}
