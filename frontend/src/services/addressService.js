import { getToken } from './authService';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const uploadAddress = async (address) => {
    const response = await fetch(`${BASE_URL}address/uploadAddress`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": getToken(),
        },
        body: JSON.stringify(address),
    });
    return response;
}

export const updateAddress = async (address) => {
    const response = await fetch(`${BASE_URL}address/updateAddress`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": getToken(),
        },
        body: JSON.stringify(address),
    });
    return response;
}

export const getAddressListFromServer = async () => {
    const response = await fetch(`${BASE_URL}address/addresses`, {
        method: "GET",
        headers: {
            "Authorization": getToken(),
        },
    });
    return response;
}

export const deleteAddresFromServer = async (addressId) => {
    const response = await fetch(`${BASE_URL}address/delete`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": getToken(),
        },
        body: JSON.stringify({ addressId }),
    });
    return response;
}
