import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, MessageCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

/* ── Reusable input field ── */
const Field = ({ icon: Icon, type, placeholder, value, onChange, toggle, showToggle }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 10,
    background: "var(--bg-elevated)",
    border: "1px solid var(--border-subtle)",
    borderRadius: "var(--radius-md)",
    padding: "0 12px",
    transition: "border-color 0.15s",
  }}
    onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
    onBlur={(e)  => e.currentTarget.style.borderColor = "var(--border-subtle)"}
  >
    <Icon size={15} color="var(--text-muted)" style={{ flexShrink: 0 }} />
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        flex: 1, background: "transparent", border: "none",
        padding: "12px 0", fontSize: 14,
        color: "var(--text-primary)", outline: "none",
      }}
    />
    {showToggle && (
      <button
        type="button"
        onClick={toggle}
        style={{ background: "none", border: "none", padding: 0, display: "flex", color: "var(--text-muted)", cursor: "pointer" }}
      >
        {type === "password" ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    )}
  </div>
);

/* ── Auth page ── */
const Auth = () => {
  const [tab,         setTab]         = useState("login");   // "login" | "register"
  const [showPass,    setShowPass]    = useState(false);
  const [form,        setForm]        = useState({ fullName: "", username: "", email: "", password: "" });

  const { login, register, isLoading } = useAuth();

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (tab === "login") {
      await login({ email: form.email, password: form.password });
    } else {
      await register({ fullName: form.fullName, username: form.username, email: form.email, password: form.password });
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--bg-base)", padding: "20px",
      position: "relative", overflow: "hidden",
    }}>
      {/* Ambient glow blobs */}
      <div style={{
        position: "absolute", width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,110,255,0.08) 0%, transparent 70%)",
        top: "-80px", left: "-80px", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", width: 300, height: 300, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,110,255,0.06) 0%, transparent 70%)",
        bottom: "-60px", right: "-60px", pointerEvents: "none",
      }} />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0,  scale: 1 }}
        transition={{ duration: 0.4, type: "spring", stiffness: 260, damping: 24 }}
        style={{
          width: "100%", maxWidth: 420,
          background: "var(--bg-sidebar)",
          border: "1px solid var(--border-base)",
          borderRadius: "var(--radius-xl)",
          padding: "36px 32px",
          position: "relative", zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <motion.div
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: 52, height: 52, borderRadius: 16,
              background: "linear-gradient(135deg, var(--accent), #a78bfa)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 14px",
              boxShadow: "0 8px 24px rgba(124,110,255,0.3)",
            }}
          >
            <MessageCircle size={24} color="#fff" />
          </motion.div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.3px" }}>
            PulseChat
          </div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
            {tab === "login" ? "Welcome back! Sign in to continue." : "Create your account to get started."}
          </div>
        </div>

        {/* Tab switcher */}
        <div style={{
          display: "flex", gap: 4, background: "var(--bg-elevated)",
          borderRadius: "var(--radius-md)", padding: 4, marginBottom: 24,
        }}>
          {["login", "register"].map((t) => (
            <motion.button
              key={t}
              onClick={() => { setTab(t); setForm({ fullName: "", username: "", email: "", password: "" }); setShowPass(false); }}
              style={{
                flex: 1, padding: "8px 0", borderRadius: "var(--radius-sm)",
                background:   tab === t ? "var(--accent)" : "transparent",
                color:        tab === t ? "#fff"          : "var(--text-muted)",
                fontSize: 13, fontWeight: 600,
                border: "none", cursor: "pointer",
                transition: "all 0.2s",
              }}
              whileTap={{ scale: 0.97 }}
            >
              {t === "login" ? "Sign In" : "Sign Up"}
            </motion.button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <AnimatePresence mode="wait">
            {tab === "register" && (
              <motion.div
                key="register-fields"
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 0 }}
                exit={{ opacity: 0, height: 0 }}
                style={{ display: "flex", flexDirection: "column", gap: 12, overflow: "hidden" }}
              >
                <Field
                  icon={User}
                  type="text"
                  placeholder="Full name"
                  value={form.fullName}
                  onChange={set("fullName")}
                />
                <Field
                  icon={User}
                  type="text"
                  placeholder="Username"
                  value={form.username}
                  onChange={set("username")}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <Field
            icon={Mail}
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={set("email")}
          />
          <Field
            icon={Lock}
            type={showPass ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={set("password")}
            showToggle
            toggle={() => setShowPass((p) => !p)}
          />

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.97 }}
            style={{
              marginTop: 8,
              padding: "13px",
              background: isLoading
                ? "var(--border-strong)"
                : "linear-gradient(135deg, var(--accent), #a78bfa)",
              border: "none",
              borderRadius: "var(--radius-md)",
              color: "#fff",
              fontSize: 14, fontWeight: 700,
              cursor: isLoading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: isLoading ? "none" : "0 4px 16px rgba(124,110,255,0.35)",
              transition: "all 0.2s",
            }}
          >
            {isLoading ? (
              <>
                <span style={{
                  width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)",
                  borderTopColor: "#fff", borderRadius: "50%",
                  animation: "spin 0.7s linear infinite", display: "inline-block",
                }} />
                {tab === "login" ? "Signing in…" : "Creating account…"}
              </>
            ) : (
              tab === "login" ? "Sign In" : "Create Account"
            )}
          </motion.button>
        </form>

        {/* Footer hint */}
        <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-muted)", marginTop: 20 }}>
          {tab === "login"
            ? <>No account?{" "}<span style={{ color: "var(--accent)", cursor: "pointer", fontWeight: 600 }} onClick={() => setTab("register")}>Sign up</span></>
            : <>Already have an account?{" "}<span style={{ color: "var(--accent)", cursor: "pointer", fontWeight: 600 }} onClick={() => setTab("login")}>Sign in</span></>
          }
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;