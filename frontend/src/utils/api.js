import axios from "axios";
import store from "../store/store.js"; // Redux store

const baseURL = import.meta.env.DEV
  ? "http://localhost:8000/api/v1"
  : import.meta.env.VITE_BACKEND_URL;

if (!baseURL) {
  console.error("VITE_BACKEND_URL is missing!");
}

const api = axios.create({
  baseURL,
  withCredentials: true,
});
// Add JWT to Authorization header if it exists
api.interceptors.request.use((config) => {
  const token = store.getState().auth?.userData?.token;

  if (token && typeof token === "string" && token.length > 0) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
