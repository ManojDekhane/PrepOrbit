import axios from "axios";

const API = axios.create({
    // baseURL: "http://localhost:5000/api",
    baseURL: process.env.API_BASE_URL,
    withCredentials: true,
});

export default API;