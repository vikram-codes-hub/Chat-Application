import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import Avatar from "../common/Avatar";
import EditProfileModal from "./EditProfileModal";

const Stat = ({ label, value }) => (
  <div style={{ textAlign: "center", padding: "10px 16px", background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}>
    <div style={{ fontSize: 17, fontWeight: 700, color: "var(--text-primary)" }}>{value}</div>
    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{label}</div>
  </div>
);

const ProfileCard = () => {
  const { authUser, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, width: "100%" }}>
        <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.35, type: "spring" }}>
          <Avatar user={authUser} size="xl" showOnline isOnline />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>{authUser?.fullName}</h2>
          <p style={{ fontSize: 13, color: "var(--accent)", marginBottom: 6 }}>@{authUser?.username}</p>
          {authUser?.bio && <p style={{ fontSize: 13, color: "var(--text-muted)", maxWidth: 280, lineHeight: 1.5 }}>{authUser.bio}</p>}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
          <Stat label="Messages"     value="1,284"  />
          <Stat label="Chats"        value="38"     />
          <Stat label="Member since" value="Apr '26" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ display: "flex", gap: 10, width: "100%", maxWidth: 320 }}>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => setShowModal(true)}
            style={{ flex: 1, padding: "10px 0", background: "var(--accent)", border: "none", borderRadius: "var(--radius-md)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
          >
            <Edit2 size={13} /> Edit profile
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={logout}
            style={{ flex: 1, padding: "10px 0", background: "transparent", border: "1px solid #ef444440", borderRadius: "var(--radius-md)", color: "#ef4444", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
          >
            <LogOut size={13} /> Sign out
          </motion.button>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
          style={{ width: "100%", maxWidth: 320, padding: "12px 16px", background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}>
          <div style={{ fontSize: 11, color: "var(--text-hint)", marginBottom: 3 }}>Email address</div>
          <div style={{ fontSize: 14, color: "var(--text-primary)" }}>{authUser?.email}</div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showModal && <EditProfileModal onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </>
  );
};

export default ProfileCard;