// const BASE_URL = "http://localhost:3000/api/";
const BASE_URL = "https://shop-adda-backend.vercel.app/api";

export const uploadProductToServer = async (product) => {
    const response = await fetch(`${BASE_URL}product/uploadProduct`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
    });
    return response;
}

export const getProductsToserver = async () => {
    const response = await fetch(`${BASE_URL}product/getProducts`);
    return response;
}
