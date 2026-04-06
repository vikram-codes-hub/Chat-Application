import { createContext, useContext, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { mockAuthUser } from "../data/mockData";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authUser,          setAuthUser]          = useState(null);
  const [isCheckingAuth,    setIsCheckingAuth]    = useState(true);
  const [isLoading,         setIsLoading]         = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // GET /api/auth/me
  const checkAuth = useCallback(async () => {
    try {
      const res = await api.get("/auth/me");
      setAuthUser(res.data);
    } catch {
      setAuthUser(null);
    } finally {
      setIsCheckingAuth(false);
    }
  }, []);

  useEffect(() => { checkAuth(); }, [checkAuth]);

  // POST /api/auth/login
  const login = async (data) => {
    setIsLoading(true);
    try {
      const res = await api.post("/auth/login", data);
      setAuthUser(res.data);
      toast.success("Welcome back!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  // POST /api/auth/register
  const register = async (data) => {
    setIsLoading(true);
    try {
      const res = await api.post("/auth/register", data);
      setAuthUser(res.data);
      toast.success("Account created!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Sign up failed");
    } finally {
      setIsLoading(false);
    }
  };

  // POST /api/auth/logout
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
    setAuthUser(null);
    toast.success("Logged out");
  };

  // PUT /api/users/profile
  const updateProfile = async (data) => {
    setIsUpdatingProfile(true);
    try {
      const res = await api.put("/users/profile", data);
      setAuthUser(res.data);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // DEV: skip backend
  const useMockAuth = () => {
    setAuthUser(mockAuthUser);
    setIsCheckingAuth(false);
    toast.success("Dev mode — mock user loaded");
  };

  return (
    <AuthContext.Provider value={{
      authUser, isCheckingAuth, isLoading, isUpdatingProfile,
      login, register, logout, updateProfile, checkAuth, useMockAuth,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};