import axios from "axios"

export const contactRequest = async () => {
    const config = { withCredentials: true }
    const response = await axios.get(`http://localhost:3001/relatedPerson/email`, config)
    console.log(response.data)
    return response.data
}
