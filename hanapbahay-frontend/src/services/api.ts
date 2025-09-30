import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8080/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (import.meta.env.DEV) {
      console.error(
        "[API] request failed",
        error?.config?.method?.toUpperCase(),
        error?.config?.url,
        error?.response?.status,
        error?.response?.data,
      );
    }

    return Promise.reject(error);
  },
);

export { api };
