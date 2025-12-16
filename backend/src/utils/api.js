import axios from "axios";

// Use Vite proxy in dev, full backend URL in production
const baseURL = import.meta.env.DEV ? "" : import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export default api;
