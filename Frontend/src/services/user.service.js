import api from "./api";

// GET /api/users?search=
export const getUsersApi = (search = "") =>
  api.get(`/users${search ? `?search=${search}` : ""}`);

// GET /api/users/:id
export const getUserByIdApi = (id) => api.get(`/users/${id}`);

// PUT /api/users/profile
export const updateProfileApi = (data) => api.put("/users/profile", data);

// PUT /api/users/status
export const updateStatusApi = (status) => api.put("/users/status", { status });