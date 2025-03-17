import axios from "axios";
import { API_URL } from "../config/config";

export const checkAuth = async () => {
    const response = await axios.get(`${API_URL}/auth/me/`, {
        withCredentials: true // ✅ Ensures session cookie is sent
    });
    return response.data;
};