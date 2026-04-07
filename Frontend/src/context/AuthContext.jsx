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

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("pulsechat_token");
    if (!token) { setIsCheckingAuth(false); return; }
    try {
      const res = await api.get("/auth/me");
      setAuthUser(res.data);
    } catch {
      localStorage.removeItem("pulsechat_token");
      setAuthUser(null);
    } finally {
      setIsCheckingAuth(false);
    }
  }, []);

  useEffect(() => { checkAuth(); }, [checkAuth]);

  const login = async (data) => {
    setIsLoading(true);
    try {
      const res = await api.post("/auth/login", data);
      localStorage.setItem("pulsechat_token", res.data.token);
      setAuthUser(res.data);
      toast.success("Welcome back!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data) => {
    setIsLoading(true);
    try {
      const res = await api.post("/auth/register", data);
      localStorage.setItem("pulsechat_token", res.data.token);
      setAuthUser(res.data);
      toast.success("Account created!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Sign up failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try { await api.post("/auth/logout"); } catch {}
    localStorage.removeItem("pulsechat_token");
    setAuthUser(null);
    toast.success("Logged out");
  };

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