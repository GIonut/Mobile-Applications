import axios from "axios";
import {baseUrl, config} from "../core";

const authUrl = `http://${baseUrl}/api/auth/login`;

export const loginAPI: (username?:string, password?:string) => Promise<string>
    = async (username, password) => {
    const response = await axios.post(authUrl, {username, password}, config);
    return response.data.token;
}