import { createContext, useContext, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { mockAuthUser } from "../data/mockData";
import { loginApi, registerApi, logoutApi, getMeApi } from "../services/auth.service";
import { updateProfileApi } from "../services/user.service";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authUser,         setAuthUser]         = useState(null);
  const [isCheckingAuth,   setIsCheckingAuth]   = useState(true);
  const [isLoading,        setIsLoading]        = useState(false);
  const [isUpdatingProfile,setIsUpdatingProfile]= useState(false);

  const checkAuth = useCallback(async () => {
    try {
      const res = await getMeApi();
      setAuthUser(res.data);
    } catch {
      setAuthUser(null);
    } finally {
      setIsCheckingAuth(false);
    }
  }, []);

  useEffect(() => { checkAuth(); }, [checkAuth]);

  const login = async (data) => {
    setIsLoading(true);
    try {
      const res = await loginApi(data);
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
      const res = await registerApi(data);
      setAuthUser(res.data);
      toast.success("Account created!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Sign up failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch {}
    setAuthUser(null);
    toast.success("Logged out");
  };

  const updateProfile = async (data) => {
    setIsUpdatingProfile(true);
    try {
      const res = await updateProfileApi(data);
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
  };

  return (
    <AuthContext.Provider value={{
      authUser, isCheckingAuth, isLoading, isUpdatingProfile,
      login, register, logout, updateProfile, useMockAuth,
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