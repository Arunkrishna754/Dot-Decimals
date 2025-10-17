import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // correct in Vite
});

// Named export
export { API };

// Default export
export default API;
