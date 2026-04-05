import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "var(--bg-base)", gap: 18,
    }}>
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.12 }}
        transition={{ duration: 0.4, type: "spring" }}
        style={{ width: 80, height: 80, borderRadius: 24, background: "var(--accent)" }}
      />
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} style={{ textAlign: "center" }}>
        <div style={{ fontSize: 72, fontWeight: 800, color: "var(--text-hint)", lineHeight: 1 }}>404</div>
        <div style={{ fontSize: 18, fontWeight: 600, color: "var(--text-secondary)", marginTop: 8 }}>Page not found</div>
        <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 6 }}>The page you're looking for doesn't exist.</div>
      </motion.div>
      <motion.button
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
        onClick={() => navigate("/")}
        style={{
          padding: "10px 28px", background: "var(--accent)", border: "none",
          borderRadius: "var(--radius-md)", color: "#fff",
          fontSize: 14, fontWeight: 600, cursor: "pointer",
        }}
      >
        Back to PulseChat
      </motion.button>
    </div>
  );
};

export default NotFound;