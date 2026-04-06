import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Zap, MessageSquare, Shield, Globe } from "lucide-react";
import { useAuth } from "../context/AuthContext";

/* ── Refined input field with smoother interactions ── */
const Field = ({ icon: Icon, type, placeholder, value, onChange, toggle, showToggle, id }) => {
  const [focused, setFocused] = useState(false);

  return (
    <motion.div
      animate={{
        borderColor: focused
          ? "rgba(124,110,255,0.5)"
          : "rgba(255,255,255,0.07)",
      }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 11,
        background: focused
          ? "rgba(124,110,255,0.03)"
          : "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 10,
        padding: "12px 16px",
        transition: "background 0.2s, border-color 0.2s",
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <Icon
        size={16}
        color={focused ? "rgba(124,110,255,0.6)" : "rgba(255,255,255,0.3)"}
        style={{ flexShrink: 0, transition: "color 0.2s" }}
      />
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          flex: 1,
          background: "transparent",
          border: "none",
          padding: "2px 0",
          fontSize: "14px",
          fontWeight: 400,
          color: "#e8e8f0",
          outline: "none",
          fontFamily: "inherit",
          letterSpacing: "0.3px",
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {showToggle && (
        <motion.button
          type="button"
          onClick={toggle}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            display: "flex",
            color: focused ? "rgba(124,110,255,0.6)" : "rgba(255,255,255,0.3)",
            cursor: "pointer",
            transition: "color 0.2s",
          }}
        >
          {type === "password" ? <EyeOff size={16} /> : <Eye size={16} />}
        </motion.button>
      )}
    </motion.div>
  );
};

/* ── Enhanced feature pill ── */
const FeaturePill = ({ icon: Icon, label }) => (
  <motion.div
    whileHover={{ scale: 1.05, y: -2 }}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(124,110,255,0.2)",
      borderRadius: 12,
      padding: "8px 16px",
      fontSize: "12px",
      fontWeight: 500,
      color: "rgba(255,255,255,0.7)",
      backdropFilter: "blur(10px)",
      cursor: "default",
      transition: "all 0.2s",
    }}
  >
    <Icon size={14} color="#a78bfa" strokeWidth={2} />
    {label}
  </motion.div>
);

/* ── Auth page ── */
const Auth = () => {
  const [tab, setTab] = useState("login");
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ fullName: "", username: "", email: "", password: "" });

  const { login, register, isLoading } = useAuth();

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (tab === "login") {
      await login({ email: form.email, password: form.password });
    } else {
      await register({
        fullName: form.fullName,
        username: form.username,
        email: form.email,
        password: form.password,
      });
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "#0a0a0f",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── Background mesh gradient ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 60% at 20% 50%, rgba(124,110,255,0.11) 0%, transparent 60%), " +
            "radial-gradient(ellipse 60% 80% at 80% 20%, rgba(167,139,250,0.06) 0%, transparent 55%), " +
            "radial-gradient(ellipse 40% 40% at 50% 90%, rgba(99,102,241,0.05) 0%, transparent 50%)",
          pointerEvents: "none",
        }}
      />

      {/* ── Animated orbs ── */}
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,110,255,0.07) 0%, transparent 70%)",
          top: -100,
          left: -100,
          pointerEvents: "none",
        }}
      />
      <motion.div
        animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        style={{
          position: "absolute",
          width: 380,
          height: 380,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)",
          bottom: -80,
          right: -80,
          pointerEvents: "none",
        }}
      />

      {/* ══════════════════════════════════════
          LEFT PANEL — Branding
      ══════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "60px 64px",
          position: "relative",
          zIndex: 1,
        }}
        className="auth-left-panel"
      >
        {/* Logo mark */}
        <motion.div
          style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 56 }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "linear-gradient(135deg, #7c6eff, #a78bfa)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 32px rgba(124,110,255,0.3)",
              flexShrink: 0,
            }}
          >
            <img
              src="/favicon.svg"
              alt="PulseChat logo"
              style={{ width: 26, height: 26, display: "block" }}
            />
          </div>
          <span
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.4px",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            PulseChat
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ marginBottom: 28 }}
        >
          <h1
            style={{
              fontSize: "clamp(32px, 4vw, 52px)",
              fontWeight: 800,
              lineHeight: 1.15,
              color: "#fff",
              margin: 0,
              letterSpacing: "-1px",
            }}
          >
            Connect.{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #7c6eff, #c4b5fd)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Chat.
            </span>
            <br />
            Collaborate.
          </h1>
        </motion.div>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            fontSize: 15,
            color: "rgba(255,255,255,0.52)",
            lineHeight: 1.7,
            maxWidth: 420,
            margin: "0 0 52px 0",
            fontWeight: 400,
          }}
        >
          Real-time messaging built for teams and individuals. Lightning-fast, beautifully designed,
          and always in sync.
        </motion.p>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{ display: "flex", flexWrap: "wrap", gap: 12 }}
        >
          <FeaturePill icon={Zap} label="Real-time messaging" />
          <FeaturePill icon={Shield} label="End-to-end secure" />
          <FeaturePill icon={Globe} label="Works everywhere" />
          <FeaturePill icon={MessageSquare} label="Rich conversations" />
        </motion.div>

        {/* Decorative card preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          style={{
            marginTop: 72,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 16,
            padding: "24px 28px",
            maxWidth: 360,
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Mock message bubbles */}
          {[
            { text: "Hey team! The new build is live 🚀", out: false, name: "Alex" },
            { text: "Looks great! Testing now.", out: true },
            { text: "Ship it! 🔥", out: false, name: "Sam" },
          ].map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: msg.out ? 10 : -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + i * 0.15 }}
              style={{
                display: "flex",
                justifyContent: msg.out ? "flex-end" : "flex-start",
                marginBottom: i < 2 ? 12 : 0,
              }}
            >
              <div
                style={{
                  maxWidth: "78%",
                  padding: "10px 14px",
                  borderRadius: msg.out ? "12px 12px 3px 12px" : "12px 12px 12px 3px",
                  background: msg.out
                    ? "linear-gradient(135deg, #7c6eff, #a78bfa)"
                    : "rgba(255,255,255,0.08)",
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: 400,
                  lineHeight: 1.5,
                }}
              >
                {!msg.out && msg.name && (
                  <div style={{ fontSize: "10px", color: "#a78bfa", fontWeight: 600, marginBottom: 3 }}>
                    {msg.name}
                  </div>
                )}
                {msg.text}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── Vertical divider ── */}
      <div
        style={{
          width: 1,
          background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.06) 80%, transparent)",
          alignSelf: "stretch",
          flexShrink: 0,
          zIndex: 1,
        }}
        className="auth-divider"
      />

      {/* ══════════════════════════════════════
          RIGHT PANEL — Form
      ══════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          width: "100%",
          maxWidth: 480,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 52px",
          position: "relative",
          zIndex: 1,
          flexShrink: 0,
        }}
        className="auth-right-panel"
      >
        {/* Mobile logo (hidden on desktop via CSS) */}
        <motion.div
          className="auth-mobile-logo"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 36,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: "linear-gradient(135deg, #7c6eff, #a78bfa)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 6px 20px rgba(124,110,255,0.3)",
              }}
            >
              <img src="/favicon.svg" alt="PulseChat" style={{ width: 20, height: 20 }} />
            </div>
            <span style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>PulseChat</span>
          </div>
        </motion.div>

        {/* Heading */}
        <div style={{ marginBottom: 8 }}>
          <h2
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "#fff",
              margin: 0,
              letterSpacing: "-0.5px",
            }}
          >
            {tab === "login" ? "Welcome back" : "Create account"}
          </h2>
        </div>
        <p
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: "rgba(255,255,255,0.45)",
            margin: "0 0 36px 0",
            lineHeight: 1.6,
          }}
        >
          {tab === "login"
            ? "Sign in to continue your conversations."
            : "Join PulseChat and start connecting."}
        </p>

        {/* Tab switcher */}
        <div
          style={{
            display: "flex",
            gap: 6,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 10,
            padding: 4,
            marginBottom: 32,
          }}
        >
          {["login", "register"].map((t) => (
            <motion.button
              key={t}
              id={`auth-tab-${t}`}
              onClick={() => {
                setTab(t);
                setForm({ fullName: "", username: "", email: "", password: "" });
                setShowPass(false);
              }}
              whileTap={{ scale: 0.97 }}
              style={{
                flex: 1,
                padding: "10px 0",
                borderRadius: 8,
                background: tab === t ? "linear-gradient(135deg, #7c6eff, #a78bfa)" : "transparent",
                color: tab === t ? "#fff" : "rgba(255,255,255,0.45)",
                fontSize: "13px",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: tab === t ? "0 4px 12px rgba(124,110,255,0.25)" : "none",
                fontFamily: "inherit",
                letterSpacing: "0.3px",
              }}
            >
              {t === "login" ? "Sign In" : "Sign Up"}
            </motion.button>
          ))}
        </div>

        {/* Form */}
        <form
          id="auth-form"
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          <AnimatePresence mode="wait">
            {tab === "register" && (
              <motion.div
                key="register-extra-fields"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                style={{ display: "flex", flexDirection: "column", gap: 16, overflow: "hidden" }}
              >
                <Field
                  id="auth-fullname"
                  icon={User}
                  type="text"
                  placeholder="Full name"
                  value={form.fullName}
                  onChange={set("fullName")}
                />
                <Field
                  id="auth-username"
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
            id="auth-email"
            icon={Mail}
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={set("email")}
          />
          <Field
            id="auth-password"
            icon={Lock}
            type={showPass ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={set("password")}
            showToggle
            toggle={() => setShowPass((p) => !p)}
          />

          {/* Forgot password (login only) */}
          {tab === "login" && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{ textAlign: "right", marginTop: -4 }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "#a78bfa",
                  cursor: "pointer",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#c4b5fd")}
                onMouseLeave={(e) => (e.target.style.color = "#a78bfa")}
              >
                Forgot password?
              </span>
            </motion.div>
          )}

          <motion.button
            id="auth-submit-btn"
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.97 }}
            style={{
              marginTop: 8,
              padding: "14px",
              background: isLoading
                ? "rgba(255,255,255,0.06)"
                : "linear-gradient(135deg, #7c6eff, #a78bfa)",
              border: "none",
              borderRadius: 10,
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
              cursor: isLoading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: isLoading ? "none" : "0 6px 20px rgba(124,110,255,0.35)",
              transition: "all 0.2s",
              fontFamily: "inherit",
              letterSpacing: "0.3px",
            }}
          >
            {isLoading ? (
              <>
                <span
                  style={{
                    width: 15,
                    height: 15,
                    border: "2px solid rgba(255,255,255,0.25)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    animation: "spin 0.7s linear infinite",
                    display: "inline-block",
                  }}
                />
                {tab === "login" ? "Signing in…" : "Creating account…"}
              </>
            ) : tab === "login" ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <p
          style={{
            textAlign: "center",
            fontSize: 13,
            fontWeight: 400,
            color: "rgba(255,255,255,0.35)",
            marginTop: 32,
          }}
        >
          {tab === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <motion.span
                whileHover={{ color: "#c4b5fd" }}
                style={{
                  color: "#a78bfa",
                  cursor: "pointer",
                  fontWeight: 600,
                  transition: "color 0.2s",
                }}
                onClick={() => setTab("register")}
              >
                Sign up
              </motion.span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <motion.span
                whileHover={{ color: "#c4b5fd" }}
                style={{
                  color: "#a78bfa",
                  cursor: "pointer",
                  fontWeight: 600,
                  transition: "color 0.2s",
                }}
                onClick={() => setTab("login")}
              >
                Sign in
              </motion.span>
            </>
          )}
        </p>

        {/* Terms */}
        <p
          style={{
            textAlign: "center",
            fontSize: 11,
            fontWeight: 400,
            color: "rgba(255,255,255,0.25)",
            marginTop: 18,
            lineHeight: 1.7,
          }}
        >
          By continuing you agree to our{" "}
          <span style={{ color: "rgba(255,255,255,0.35)", cursor: "pointer" }}>
            Terms of Service
          </span>{" "}
          &amp;{" "}
          <span style={{ color: "rgba(255,255,255,0.35)", cursor: "pointer" }}>
            Privacy Policy
          </span>
        </p>
      </motion.div>

      {/* ── Responsive CSS ── */}
      <style>{`
        @media (max-width: 768px) {
          .auth-left-panel { display: none !important; }
          .auth-divider     { display: none !important; }
          .auth-right-panel {
            max-width: 100% !important;
            padding: 40px 28px !important;
          }
          .auth-mobile-logo { display: flex !important; }
        }
        @media (min-width: 769px) {
          .auth-mobile-logo { display: none !important; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Auth;