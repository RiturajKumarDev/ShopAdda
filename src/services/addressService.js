const BASE_URL = "http://localhost:3000/api/";
// const BASE_URL = "https://shop-adda-backend.vercel.app/api/";

export const uploadAddress = async (address) => {
    const response = await fetch(`${BASE_URL}address/uploadAddress`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(address),
    });
    return response;
}

export const updateAddress = async (address) => {
    const response = await fetch(`${BASE_URL}address/updateAddress`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(address),
    });
    return response;
}

export const getAddressListFromServer = async (userId) => {
    const response = await fetch(`${BASE_URL}address/addresses/${userId}`);
    return response;
}

export const deleteAddresFromServer = async (userId, addressId) => {
    const response = await fetch(`${BASE_URL}address/delete`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, addressId }),
    });
    return response;
}
