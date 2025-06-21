// utils/axiosInstance.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080", // base URL
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isHandlingSessionTimeout = false;

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if ((status === 400 || status === 401) && !isHandlingSessionTimeout) {
      isHandlingSessionTimeout = true;

      // Small delay to allow this flag to settle before redirect
      setTimeout(() => {
        alert("Session timeout. Please login again.");
        localStorage.clear();
        window.location.href = "/login";
      }, 0);
    }

    return Promise.reject(error);
  }
);

export default instance;
