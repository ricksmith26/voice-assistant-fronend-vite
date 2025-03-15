import axios from "axios";
import { API_URL } from "../config/config";

export const axiosIns = () => {
    return axios.create({
        baseURL: `${API_URL}`,
        timeout: 1000,
        headers: {'X-Custom-Header': 'foobar'}
      });
}
