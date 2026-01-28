
import axios from "axios";


const axiosInstance = axios.create({
  baseURL: "https://localhost:5069/api",
  timeout: 1000000, // Optional
  headers: {
    "Content-Type": "application/json",
  },
});


axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {

    if (error.response?.status === 401) {
      console.warn("Unauthorized - redirect to login");
      // redirect logic
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;