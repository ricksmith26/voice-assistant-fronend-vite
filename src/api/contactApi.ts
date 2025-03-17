import axios from "axios"
import { API_URL } from "../config/config"

export const contactRequest = async () => {
    const config = { withCredentials: true }
    const email = localStorage.getItem('email')
    console.log(email, '<<<<<')
    const response = await axios.get(`${API_URL}/relatedPerson/getByEmail`, config)
    console.log(response.data)
    return response.data
}
