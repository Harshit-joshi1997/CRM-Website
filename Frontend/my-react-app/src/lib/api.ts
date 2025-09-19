import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // Your API's base URL
});

// Add a request interceptor to include the JWT in every request
api.interceptors.request.use(
  (config) => {
    // We read from localStorage because this interceptor is outside of React's component tree and hooks.
    const loginDataString = localStorage.getItem("loginData");
    if (loginDataString) {
      const { token } = JSON.parse(loginDataString);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
