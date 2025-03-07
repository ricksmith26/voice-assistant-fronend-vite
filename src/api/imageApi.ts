import axios from "axios";

export const getImagesRequest = async (accessToken: string) => {
    // const config = { withCredentials: true }
    // const response = await axios.get("http://localhost:3001/images/all", config)
    // return response.data
    const response = await axios
    .get(`http://localhost:3001/images/all`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    return response;
}