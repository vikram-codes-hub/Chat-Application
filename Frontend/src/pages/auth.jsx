import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, MessageCircle, Zap, Shield } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import Spinner from "../components/common/Spinner";
import pulsechatLogo from "../assets/pulsechat_logo.svg";

/* ── Field ── */
const Field = ({ label, icon, type = "text", placeholder, value, onChange, delay = 0 }) => {
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);
  const isPass = type === "password";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      style={{ marginBottom: 14 }}
    >
      <label style={{
        fontSize: 11, color: "var(--text-muted)", display: "block",
        marginBottom: 6, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase",
      }}>
        {label}
      </label>
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        background: focused ? "rgba(99,102,241,0.06)" : "var(--bg-elevated)",
        border: `1px solid ${focused ? "var(--accent)" : "var(--border-subtle)"}`,
        borderRadius: "var(--radius-md)", padding: "11px 14px",
        transition: "all 0.2s",
        boxShadow: focused ? "0 0 0 3px rgba(99,102,241,0.12)" : "none",
      }}>
        <span style={{ display: "flex", opacity: focused ? 1 : 0.5, transition: "opacity 0.2s" }}>{icon}</span>
        <input
          type={isPass && !show ? "password" : "text"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete={isPass ? "current-password" : "off"}
          style={{
            flex: 1, background: "transparent", border: "none",
            color: "var(--text-primary)", fontSize: 14, outline: "none",
            fontFamily: "inherit",
          }}
        />
        {isPass && (
          <button
            onClick={() => setShow(!show)}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 0, opacity: 0.5 }}
          >
            {show ? <EyeOff size={14} color="var(--text-muted)" /> : <Eye size={14} color="var(--text-muted)" />}
          </button>
        )}
      </div>
    </motion.div>
  );
};

/* ── Left panel feature pill ── */
const FeaturePill = ({ icon, text, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay }}
    style={{
      display: "flex", alignItems: "center", gap: 10,
      background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 99, padding: "8px 16px", width: "fit-content",
    }}
  >
    <span style={{ color: "#a5b4fc" }}>{icon}</span>
    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>{text}</span>
  </motion.div>
);

/* ── Login form ── */
const LoginForm = ({ onSwitch }) => {
  const { login, isLoading, useMockAuth } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <motion.div
      key="login"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.25 }}
    >
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4, letterSpacing: "-0.3px" }}>
          Welcome back
        </h2>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 26 }}>
          Sign in to your PulseChat account
        </p>
      </motion.div>

      <Field label="Email" type="email" icon={<Mail size={14} color="var(--text-muted)" />}
        placeholder="you@example.com" value={form.email} onChange={set("email")} delay={0.05} />
      <Field label="Password" type="password" icon={<Lock size={14} color="var(--text-muted)" />}
        placeholder="••••••••" value={form.password} onChange={set("password")} delay={0.1} />

      <motion.button
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(99,102,241,0.35)" }}
        whileTap={{ scale: 0.97 }}
        onClick={() => login(form)}
        disabled={isLoading}
        style={{
          width: "100%", padding: "13px 0", marginTop: 8,
          background: "linear-gradient(135deg, #6366f1, #818cf8)",
          border: "none", borderRadius: "var(--radius-md)", color: "#fff",
          fontSize: 14, fontWeight: 600, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          opacity: isLoading ? 0.75 : 1, transition: "opacity 0.2s",
          letterSpacing: "0.01em",
        }}
      >
        {isLoading ? <Spinner size={16} color="#fff" /> : <><span>Sign in</span><ArrowRight size={15} /></>}
      </motion.button>

      <motion.button
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
        onClick={useMockAuth}
        style={{
          width: "100%", padding: "10px 0", marginTop: 10,
          background: "transparent", border: "1px dashed var(--border-strong)",
          borderRadius: "var(--radius-md)", color: "var(--text-muted)",
          fontSize: 13, cursor: "pointer", fontFamily: "inherit",
        }}
      >
        ⚡ Dev: skip login with mock user
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
        style={{ textAlign: "center", fontSize: 13, color: "var(--text-muted)", marginTop: 24 }}
      >
        Don't have an account?{" "}
        <button onClick={onSwitch} style={{ background: "none", border: "none", color: "var(--accent)", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>
          Sign up
        </button>
      </motion.p>
    </motion.div>
  );
};

/* ── Register form ── */
const RegisterForm = ({ onSwitch }) => {
  const { register, isLoading } = useAuth();
  const [form, setForm] = useState({ fullName: "", username: "", email: "", password: "" });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <motion.div
      key="register"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.25 }}
    >
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4, letterSpacing: "-0.3px" }}>
          Create account
        </h2>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 26 }}>
          Join PulseChat and start chatting
        </p>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Full name" icon={<User size={14} color="var(--text-muted)" />}
          placeholder="Vikram Kumar" value={form.fullName} onChange={set("fullName")} delay={0.05} />
        <Field label="Username" icon={<span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 700 }}>@</span>}
          placeholder="vikramk" value={form.username} onChange={set("username")} delay={0.08} />
      </div>
      <Field label="Email" type="email" icon={<Mail size={14} color="var(--text-muted)" />}
        placeholder="you@example.com" value={form.email} onChange={set("email")} delay={0.11} />
      <Field label="Password" type="password" icon={<Lock size={14} color="var(--text-muted)" />}
        placeholder="Min 8 characters" value={form.password} onChange={set("password")} delay={0.14} />

      <motion.button
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
        whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(99,102,241,0.35)" }}
        whileTap={{ scale: 0.97 }}
        onClick={() => register(form)}
        disabled={isLoading}
        style={{
          width: "100%", padding: "13px 0", marginTop: 8,
          background: "linear-gradient(135deg, #6366f1, #818cf8)",
          border: "none", borderRadius: "var(--radius-md)", color: "#fff",
          fontSize: 14, fontWeight: 600, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          opacity: isLoading ? 0.75 : 1, transition: "opacity 0.2s",
          letterSpacing: "0.01em",
        }}
      >
        {isLoading ? <Spinner size={16} color="#fff" /> : <><span>Create account</span><ArrowRight size={15} /></>}
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.23 }}
        style={{ textAlign: "center", fontSize: 13, color: "var(--text-muted)", marginTop: 24 }}
      >
        Already have an account?{" "}
        <button onClick={onSwitch} style={{ background: "none", border: "none", color: "var(--accent)", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>
          Sign in
        </button>
      </motion.p>
    </motion.div>
  );
};

/* ── Auth page ── */
const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--bg-base)", padding: 20, position: "relative", overflow: "hidden",
    }}>
      {/* Background ambient blobs */}
      <div style={{
        position: "absolute", top: "-10%", left: "-10%",
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-10%", right: "-5%",
        width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(129,140,248,0.1) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: "100%", maxWidth: 860,
          display: "grid", gridTemplateColumns: "1fr 1fr",
          background: "var(--bg-sidebar)",
          border: "1px solid var(--border-base)",
          borderRadius: "var(--radius-xl)",
          overflow: "hidden",
          position: "relative", zIndex: 1,
          boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
        }}
      >
        {/* ── LEFT PANEL ── */}
        <div style={{
          background: "linear-gradient(145deg, #1e1b4b 0%, #1a1040 50%, #0f0c29 100%)",
          padding: "44px 36px",
          display: "flex", flexDirection: "column", justifyContent: "space-between",
          position: "relative", overflow: "hidden",
        }}>
          {/* Decorative grid lines */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "linear-gradient(rgba(99,102,241,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.08) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            pointerEvents: "none",
          }} />
          {/* Glow orb */}
          <div style={{
            position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)",
            width: 280, height: 280, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40 }}
            >
              <img src={pulsechatLogo} alt="PulseChat" style={{ height: 36 }} />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{
                fontSize: 26, fontWeight: 800, color: "#fff",
                lineHeight: 1.25, letterSpacing: "-0.5px", marginBottom: 14,
              }}
            >
              Chat that feels{" "}
              <span style={{ color: "#a5b4fc" }}>alive.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.28 }}
              style={{ fontSize: 13.5, color: "rgba(255,255,255,0.5)", lineHeight: 1.65, marginBottom: 32 }}
            >
              Real-time messaging with the people that matter. Fast, secure, and beautifully designed.
            </motion.p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <FeaturePill icon={<Zap size={13} />} text="Instant delivery" delay={0.35} />
              <FeaturePill icon={<Shield size={13} />} text="End-to-end encrypted" delay={0.42} />
              <FeaturePill icon={<MessageCircle size={13} />} text="Rich media & reactions" delay={0.49} />
            </div>
          </div>

          {/* Bottom tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", position: "relative", zIndex: 1 }}
          >
            © 2025 PulseChat · All rights reserved
          </motion.p>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={{ padding: "44px 36px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {/* Tab pills */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            style={{
              display: "flex", background: "var(--bg-base)",
              border: "1px solid var(--border-subtle)",
              borderRadius: 999, padding: 3, gap: 2, marginBottom: 28,
              alignSelf: "flex-start",
            }}
          >
            {[{ label: "Sign in", val: true }, { label: "Sign up", val: false }].map(({ label, val }) => (
              <motion.button
                key={label}
                onClick={() => setIsLogin(val)}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: "6px 22px", borderRadius: 999, border: "none",
                  background: isLogin === val ? "linear-gradient(135deg, #6366f1, #818cf8)" : "transparent",
                  color: isLogin === val ? "#fff" : "var(--text-muted)",
                  fontSize: 13, fontWeight: 600, cursor: "pointer",
                  transition: "all 0.2s", fontFamily: "inherit",
                  boxShadow: isLogin === val ? "0 2px 12px rgba(99,102,241,0.3)" : "none",
                }}
              >
                {label}
              </motion.button>
            ))}
          </motion.div>

          {/* Form */}
          <AnimatePresence mode="wait">
            {isLogin
              ? <LoginForm key="login" onSwitch={() => setIsLogin(false)} />
              : <RegisterForm key="register" onSwitch={() => setIsLogin(true)} />
            }
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;