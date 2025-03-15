import axios from "axios"
import { API_URL } from "../config/config"

export const contactRequest = async () => {
    const config = { withCredentials: true }
    const response = await axios.get(`${API_URL}/relatedPerson/email`, config)
    console.log(response.data)
    return response.data
}
