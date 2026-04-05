import { motion, AnimatePresence } from "framer-motion";

const TypingIndicator = ({ show, userName }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 4 }}
        transition={{ duration: 0.2 }}
        style={{ display: "flex", flexDirection: "column", gap: 4, paddingLeft: 4 }}
      >
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          background: "var(--bubble-in)", border: "1px solid var(--bubble-in-border)",
          borderRadius: 14, borderBottomLeftRadius: 4,
          padding: "10px 14px", width: "fit-content",
        }}>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
              style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--text-muted)" }}
            />
          ))}
        </div>
        {userName && (
          <span style={{ fontSize: 10, color: "var(--text-hint)", paddingLeft: 4 }}>
            {userName} is typing...
          </span>
        )}
      </motion.div>
    )}
  </AnimatePresence>
);

export default TypingIndicator;