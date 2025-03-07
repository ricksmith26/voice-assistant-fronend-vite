import axios from "axios";

export const checkAuth = async(email = '' ) => {
    const config = {withCredentials: true}
    const response = await axios.get(`http://localhost:3001/auth/me/${email}`, config)
    console.log(response, '<<checkAuth')
    return response.data
}