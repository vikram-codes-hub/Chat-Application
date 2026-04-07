import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});
// Unwrap backend { success, data } envelope
api.interceptors.response.use(
  (res) => {
    // If backend wraps in { success, data } — unwrap to res.data = actual data
    if (res.data && typeof res.data === "object" && "data" in res.data) {
      res.data = res.data.data;
    }
    return res;
  },
  (err) => {
    // NOTE: Do NOT auto-redirect on 401 here.
    // AuthContext.checkAuth() catches 401 and sets authUser = null,
    // which lets the React Router guard redirect to /auth cleanly.
    // Auto-redirecting here causes an infinite page-refresh loop because
    // every page load fires checkAuth → 401 → redirect → checkAuth → ...
    return Promise.reject(err);
  }
);

export default api;