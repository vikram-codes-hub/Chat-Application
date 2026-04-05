import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, User } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import Avatar from "./Avatar";
import pulsechatLogo from "../../assets/pulsechat_logo.svg";

const Navbar = () => {
  const { authUser, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 20px", height: 54,
        background: "var(--bg-header)",
        borderBottom: "1px solid var(--border-base)",
        flexShrink: 0, zIndex: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <img src={pulsechatLogo} alt="PulseChat" style={{ height: 28 }} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/profile")}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "6px 12px", borderRadius: "var(--radius-md)",
            background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)",
            color: "var(--text-secondary)", fontSize: 13, cursor: "pointer",
          }}
        >
          <Avatar user={authUser} size="xs" />
          <span style={{ display: "none" }} className="sm-show">{authUser?.fullName?.split(" ")[0]}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={logout}
          style={{
            width: 36, height: 36, borderRadius: "var(--radius-md)",
            background: "transparent", border: "1px solid var(--border-subtle)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--text-muted)", cursor: "pointer",
          }}
        >
          <LogOut size={15} />
        </motion.button>
      </div>
    </motion.nav>
  );
};

export default Navbar;