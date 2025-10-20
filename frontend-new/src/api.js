import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL ,
});

// Named export
export { API };

// Default export
export default API;
