import axios from "axios";
import { BASE_URL, ENV_TYPE } from "../utils/constants/env";
import { getAuthToken } from "../utils/helper";

// Create a central axios instance
const apiClient = axios.create({
  baseURL: BASE_URL || "N/A",
  headers: { "Content-Type": "application/json" },
});

// Request interceptor
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

// Response interceptor
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (ENV_TYPE == "DEVELOPMANT") {
      console.error(err.response?.data || err.message);
    }
    return Promise.reject(err);
  }
);

export default apiClient;
