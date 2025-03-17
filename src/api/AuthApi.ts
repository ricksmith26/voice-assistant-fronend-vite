import axios from "axios";
import { API_URL } from "../config/config";

export const checkAuth = async () => {
    try {
        const email = localStorage.getItem('email')
        console.log(email, '<<<<<')
        const response = await axios.get(`${API_URL}/auth/me`, {
            withCredentials: true, // ✅ Ensures cookies are sent
            headers: {
                "Content-Type": "application/json", // ✅ Explicitly setting content type
            }
        });
        return response.data;
    } catch (error) {
        console.error("Auth check failed:", error);
        throw error;
    }
};