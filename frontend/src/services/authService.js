import Cookies from "js-cookie";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getToken = () => {
    const userDataStr = Cookies.get("userData");
    if (userDataStr) {
        try {
            const userData = JSON.parse(userDataStr);
            return userData.access_token ? `Bearer ${userData.access_token}` : "";
        } catch (e) {
            return "";
        }
    }
    return "";
};

export const registerUserToServer = async (user) => {
    const response = await fetch(`${BASE_URL}user/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    });
    return response;
}

export const loginUserToServer = async (email, password) => {
    const response = await fetch(`${BASE_URL}user/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });
    return response;
}

export const getUserFromServer = async () => {
    const response = await fetch(`${BASE_URL}user/getUser`, {
        method: "GET",
        headers: {
            "Authorization": getToken(),
        },
    });
    return response;
}

export const getAllUsersFromServer = async () => {
    const response = await fetch(`${BASE_URL}user/getAllUsers`, {
        method: "GET",
        headers: {
            "Authorization": getToken(),
        },
    });
    return response;
}

export const updateUserToServer = async (user) => {
    const response = await fetch(`${BASE_URL}user/update`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": getToken(),
        },
        body: JSON.stringify(user),
    });
    return response;
}

export const changePasswordToServer = async (passwords) => {
    const response = await fetch(`${BASE_URL}user/change-password`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": getToken(),
        },
        body: JSON.stringify(passwords),
    });
    return response;
}
