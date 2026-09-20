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
