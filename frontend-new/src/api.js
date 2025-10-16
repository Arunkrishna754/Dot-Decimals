import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

// Named export
export { API };

// Default export
export default API;
