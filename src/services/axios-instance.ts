import axios from "axios";
import { getSession } from "next-auth/react";

const axiosInstance = axios.create({
  baseURL: "/api/proxy", // Calls our Next.js rewrite proxy
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to automatically attach JWT token if session is active
axiosInstance.interceptors.request.use(async (config) => {
  if (typeof window !== "undefined") {
    const session = await getSession();
    if (session && (session as any).user?.accessToken) {
      config.headers.Authorization = `Bearer ${(session as any).user.accessToken}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;
