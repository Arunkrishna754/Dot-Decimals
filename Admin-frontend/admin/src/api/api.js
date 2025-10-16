import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://dot-decimals-jwdc.vercel.app/api",
});

export default API;
