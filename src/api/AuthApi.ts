import axios from "axios";

export const checkAuth = async() => {
    const config = {withCredentials: true}
    const response = await axios.get(`http://localhost:3001/auth/me/`, config)
    return response.data
}