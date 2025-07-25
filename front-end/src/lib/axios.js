import axios from "axios";

export const axiosInstance=axios.create({
    baseURL:"https://91e519ac-4526-419f-aa5f-4a851dcbc638-00-1g0mmns9x9f6x.sisko.replit.dev/api",
    withCredentials:true,
})