// const BASE_URL = "http://localhost:3000/api/";
const BASE_URL = "https://shop-adda-backend.vercel.app/api/";

export const getOderListToServer = async (userId) => {
    const response = await fetch(`${BASE_URL}order/orderList/${userId}`);
    return response;
}
