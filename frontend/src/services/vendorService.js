import { getToken } from "./authService";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getVendorDashboardStats = async () => {
    return fetch(`${BASE_URL}vendor/dashboard-stats`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": getToken()
        }
    });
};
