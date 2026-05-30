const BASE_URL = "http://localhost:3000/api/";
// const BASE_URL = "https://shop-adda-backend.vercel.app/api/";

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

export const getUserFromServer = async (_id) => {
    const response = await fetch(`${BASE_URL}user/getUser/${_id}`);
    return response;
}
