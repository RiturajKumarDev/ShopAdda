import { getToken } from './authService';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getDashboardAnalytics = async () => {
    const response = await fetch(`${BASE_URL}analytics/dashboard`, {
        method: "GET",
        headers: {
            "Authorization": getToken(),
        },
    });
    return response;
};
