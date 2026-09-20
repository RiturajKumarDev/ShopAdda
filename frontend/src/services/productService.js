const BASE_URL = import.meta.env.VITE_BASE_URL;

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
