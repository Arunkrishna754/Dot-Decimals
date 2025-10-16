import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://dot-decimals-jwdc.vercel.app/api";
});

// Named export
export { API };

// Default export
export default API;
