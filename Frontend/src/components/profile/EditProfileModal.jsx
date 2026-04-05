import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, FileText, Save } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import AvatarUpload from "./AvatarUpload";
import Spinner from "../common/Spinner";

const Field = ({ label, icon, value, onChange, placeholder, type = "text", multiline }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 5, fontWeight: 500 }}>
      {label}
    </label>
    <div style={{
      display: "flex", alignItems: multiline ? "flex-start" : "center", gap: 10,
      background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-md)", padding: "10px 14px",
    }}>
      <span style={{ paddingTop: multiline ? 1 : 0, flexShrink: 0 }}>{icon}</span>
      {multiline
        ? <textarea rows={3} value={value} onChange={onChange} placeholder={placeholder}
            style={{ flex: 1, background: "transparent", border: "none", color: "var(--text-primary)", fontSize: 14, outline: "none", resize: "none", fontFamily: "var(--font-sans)", lineHeight: 1.5 }} />
        : <input type={type} value={value} onChange={onChange} placeholder={placeholder}
            style={{ flex: 1, background: "transparent", border: "none", color: "var(--text-primary)", fontSize: 14, outline: "none" }} />
      }
    </div>
  </div>
);

const EditProfileModal = ({ onClose }) => {
  const { authUser, updateProfile, isUpdatingProfile } = useAuth();
  const [form, setForm] = useState({
    fullName: authUser?.fullName || "",
    username: authUser?.username || "",
    email:    authUser?.email    || "",
    bio:      authUser?.bio      || "",
  });
  const [avatarPreview, setAvatarPreview] = useState(authUser?.avatar || null);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = async () => {
    await updateProfile({ ...form, avatar: avatarPreview });
    onClose();
  };

  return (
    /* Overlay */
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(0,0,0,0.6)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 8 }}
        transition={{ duration: 0.25 }}
        style={{
          width: "100%", maxWidth: 440,
          background: "var(--bg-sidebar)",
          border: "1px solid var(--border-base)",
          borderRadius: "var(--radius-xl)",
          padding: 28, position: "relative",
          maxHeight: "90vh", overflowY: "auto",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 16, right: 16,
            width: 28, height: 28, borderRadius: "50%",
            background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <X size={14} color="var(--text-muted)" />
        </button>

        <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 20 }}>
          Edit profile
        </h2>

        {/* Avatar */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}>
          <AvatarUpload user={authUser} preview={avatarPreview} onUpload={setAvatarPreview} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 2 }}>
          <Field label="Full name" icon={<User size={14} color="var(--text-muted)" />}
            value={form.fullName} onChange={set("fullName")} placeholder="Your name" />
          <Field label="Username" icon={<span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>@</span>}
            value={form.username} onChange={set("username")} placeholder="username" />
        </div>

        <Field label="Email" type="email" icon={<Mail size={14} color="var(--text-muted)" />}
          value={form.email} onChange={set("email")} placeholder="you@example.com" />

        <Field label="Bio" icon={<FileText size={14} color="var(--text-muted)" />}
          value={form.bio} onChange={set("bio")} placeholder="Tell people about yourself..." multiline />

        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={isUpdatingProfile}
          style={{
            width: "100%", padding: "12px 0", marginTop: 4,
            background: "var(--accent)", border: "none",
            borderRadius: "var(--radius-md)", color: "#fff",
            fontSize: 14, fontWeight: 600, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            opacity: isUpdatingProfile ? 0.75 : 1,
          }}
        >
          {isUpdatingProfile ? <Spinner size={16} color="#fff" /> : <><Save size={14} /> Save changes</>}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default EditProfileModal;