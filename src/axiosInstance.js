import axios from "axios";

// CRA envs - only the base backend URL
const BACKEND = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

const axiosInstance = axios.create({
  baseURL: BACKEND,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// (Optional) console logging for development
// if (process.env.NODE_ENV !== "production") {
//   axiosInstance.interceptors.request.use((config) => {
//     const fullUrl = `${config.baseURL?.replace(/\/+$/, "")}/${String(config.url || "").replace(/^\/+/, "")}`;
//     console.log("[API] →", (config.method || "GET").toUpperCase(), fullUrl, config.params || {});
//     return config;
//   });
  
//   axiosInstance.interceptors.response.use(
//     (r) => r,
//     (err) => {
//       const fullUrl = `${err?.config?.baseURL?.replace(/\/+$/, "")}/${String(err?.config?.url || "").replace(/^\/+/, "")}`;
//       console.error("[API ERROR]", err?.response?.status, fullUrl, err?.response?.data);
//       return Promise.reject(err);
//     }
//   );
// }

export default axiosInstance;