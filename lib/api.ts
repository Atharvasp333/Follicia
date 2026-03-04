import axios from "axios";

/**
 * Axios instance pre-configured to communicate with the Follicia FastAPI backend.
 * Set NEXT_PUBLIC_API_URL in .env to point to your FastAPI server.
 */
export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 15000,
});

// Request interceptor — attach auth tokens if needed
api.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
);

// Response interceptor — centralised error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("[API Error]", error?.response?.data ?? error.message);
        return Promise.reject(error);
    }
);
