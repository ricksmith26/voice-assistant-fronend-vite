import { API_URL } from "../config/config";
import axiosIns from "../providers/axiosIns";

export const checkAuth = async () => {
    try {
        const response = await axiosIns.get(`${API_URL}/auth/me`);
        return response.data;
    } catch (error) {
        console.error("Auth check failed:", error);
        throw error;
    }
};