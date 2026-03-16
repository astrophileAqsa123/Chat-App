import axios from "axios";

export const axiosInstance=axios.create({
    baseURL:"https://chat-app-production-f833.up.railway.app/api",
    withCredentials:true,
})
