import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { SocketProvider }        from "./context/SocketContext";
import { ChatProvider }          from "./context/ChatContext";

import Chat     from "./pages/chat";
import Auth     from "./pages/auth";
import Profile  from "./pages/profile";
import NotFound from "./pages/notfound";
import Spinner  from "./components/common/Spinner";
import pulsechatLogo from "./assets/pulsechat_logo.svg";

/* ── Page transition wrapper ── */
const Page = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -6 }}
    transition={{ duration: 0.25, ease: "easeOut" }}
    style={{ height: "100%", width: "100%" }}
  >
    {children}
  </motion.div>
);

/* ── Route guards ── */
const Protected = ({ children }) => {
  const { authUser } = useAuth();
  return authUser ? children : <Navigate to="/auth" replace />;
};

const Public = ({ children }) => {
  const { authUser } = useAuth();
  return !authUser ? children : <Navigate to="/" replace />;
};

/* ── Loading screen ── */
const LoadingScreen = () => (
  <div style={{
    height: "100vh", display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    background: "var(--bg-base)", gap: 20,
  }}>
    <motion.img
      src={pulsechatLogo}
      alt="PulseChat"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, type: "spring" }}
      style={{ height: 36 }}
    />
    <Spinner size={22} />
  </div>
);

/* ── Inner app (needs auth context) ── */
const AppRoutes = () => {
  const { isCheckingAuth } = useAuth();
  if (isCheckingAuth) return <LoadingScreen />;

  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={
          <Protected><Page><Chat /></Page></Protected>
        } />
        <Route path="/profile" element={
          <Protected><Page><Profile /></Page></Protected>
        } />
        <Route path="/auth" element={
          <Public><Page><Auth /></Page></Public>
        } />
        <Route path="*" element={<Page><NotFound /></Page>} />
      </Routes>
    </AnimatePresence>
  );
};

/* ── Root App ── */
const App = () => (
  <AuthProvider>
    <SocketProvider>
      <ChatProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          gutter={8}
          toastOptions={{
            duration: 3500,
            style: {
              background:   "var(--bg-elevated)",
              color:        "var(--text-primary)",
              border:       "1px solid var(--border-subtle)",
              fontFamily:   "var(--font-sans)",
              fontSize:     "13px",
              borderRadius: "var(--radius-md)",
            },
            success: { iconTheme: { primary: "#22c55e", secondary: "var(--bg-elevated)" } },
            error:   { iconTheme: { primary: "#ef4444", secondary: "var(--bg-elevated)" } },
          }}
        />
      </ChatProvider>
    </SocketProvider>
  </AuthProvider>
);

export default App;