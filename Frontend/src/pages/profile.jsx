import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProfileCard from "../components/profile/ProfileCard";

const Profile = () => {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 20px", background: "var(--bg-header)", borderBottom: "1px solid var(--border-base)", flexShrink: 0 }}
      >
        <motion.button
          whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
          onClick={() => navigate("/")}
          style={{ width: 34, height: 34, borderRadius: "var(--radius-sm)", background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
        >
          <ArrowLeft size={15} color="var(--text-muted)" />
        </motion.button>
        <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>Profile</span>
      </motion.div>

      <div style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 20px" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          style={{ width: "100%", maxWidth: 480, background: "var(--bg-sidebar)", border: "1px solid var(--border-base)", borderRadius: "var(--radius-xl)", padding: "32px 24px", display: "flex", flexDirection: "column", alignItems: "center" }}
        >
          <ProfileCard />
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;