import axios from "axios";

// Use relative "/" in dev to leverage Vite proxy
// Use full backend URL in production
const baseURL = import.meta.env.DEV
  ? "/" // relative URL → goes through Vite proxy
  : import.meta.env.VITE_BACKEND_URL;

// Optional: check if baseURL is valid
if (!baseURL) {
  throw new Error("VITE_BACKEND_URL is not set! Please check your .env file.");
}

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;
