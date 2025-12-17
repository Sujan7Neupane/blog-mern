import axios from "axios";
import store from "../store/store.js"; // Redux store

const api = axios.create({
  baseURL: import.meta.env.DEV ? "/api" : import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, // Sends cookies
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
