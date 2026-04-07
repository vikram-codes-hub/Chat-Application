import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (res) => {
   
    if (res.data && typeof res.data === "object" && "data" in res.data) {
      res.data = res.data.data;
    }
    return res;
  },
  (err) => {
  
    return Promise.reject(err);
  }
);

export default api;