import axios from "axios";

export const getImagesRequest = async () => {
    const response = await axios
        .get(`http://localhost:3001/images/all`, { withCredentials: true })
    return response.data.images;
}