import api from "./api";

// POST /api/auth/register
export const registerApi = (data) => api.post("/auth/register", data);

// POST /api/auth/login
export const loginApi = (data) => api.post("/auth/login", data);

// POST /api/auth/logout
export const logoutApi = () => api.post("/auth/logout");

// GET /api/auth/me
export const getMeApi = () => api.get("/auth/me");