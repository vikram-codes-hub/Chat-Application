import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SearchBar = ({ value, onChange }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 8,
    background: "var(--bg-base)", border: "1px solid var(--border-subtle)",
    borderRadius: "var(--radius-md)", padding: "7px 10px",
  }}>
    <Search size={13} color="var(--text-muted)" style={{ flexShrink: 0 }} />
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search conversations..."
      style={{
        flex: 1, background: "transparent", border: "none",
        color: "var(--text-primary)", fontSize: 13, outline: "none",
      }}
    />
    <AnimatePresence>
      {value && (
        <motion.button
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          onClick={() => onChange("")}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}
        >
          <X size={13} color="var(--text-muted)" />
        </motion.button>
      )}
    </AnimatePresence>
  </div>
);

export default SearchBar;