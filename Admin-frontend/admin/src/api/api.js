import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_ADMIN_API_URL ||
    import.meta.env.VITE_API_URL ||
    (import.meta.env.MODE === "development"
      ? "http://localhost:3000/api"
      : "https://dot-decimals.onrender.com/api"),
});

export default API;

