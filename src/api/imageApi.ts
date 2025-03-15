import axios from "axios";
import { API_URL } from "../config/config";

export const getImagesRequest = async () => {
    const response = await axios
        .get(`${API_URL}/images/all`, { withCredentials: true })
    return response.data.images;
}