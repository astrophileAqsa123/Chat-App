import axios from "axios";

export const axiosInstance=axios.create({
    baseURL:"https://chat-app-q7up.onrender.com/api",
    withCredentials:true,
})
