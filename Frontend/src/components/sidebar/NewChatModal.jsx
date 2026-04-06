import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, MessageCircle, Loader } from "lucide-react";
import api from "../../services/api";
import Avatar from "../common/Avatar";

const NewChatModal = ({ onClose, onStartChat }) => {
  const [query,   setQuery]   = useState("");
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(null); // userId being created
  const inputRef = useRef(null);

  // Auto-focus input on open
  useEffect(() => { inputRef.current?.focus(); }, []);

  // Search users whenever query changes
  useEffect(() => {
    const controller = new AbortController();
    const delay = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get("/users", {
          params: query.trim() ? { search: query.trim() } : {},
          signal: controller.signal,
        });
        setUsers(res.data ?? []);
      } catch (err) {
        if (err.name !== "CanceledError" && err.name !== "AbortError") setUsers([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => { clearTimeout(delay); controller.abort(); };
  }, [query]);

  const handleSelect = async (user) => {
    if (creating) return;
    setCreating(user._id);
    try {
      const res = await api.post("/conversations", { participantId: user._id });
      onStartChat(res.data);
      onClose();
    } catch {
      setCreating(null);
    }
  };

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
        }}
      />

      {/* Modal */}
      <motion.div
        key="modal"
        initial={{ opacity: 0, scale: 0.92, y: -20 }}
        animate={{ opacity: 1, scale: 1,    y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: -20 }}
        transition={{ type: "spring", stiffness: 340, damping: 28 }}
        style={{
          position: "fixed", top: "12%", left: "50%", transform: "translateX(-50%)",
          zIndex: 101, width: "100%", maxWidth: 400,
          background: "var(--bg-sidebar)",
          border: "1px solid var(--border-base)",
          borderRadius: "var(--radius-xl)",
          overflow: "hidden",
          boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 16px 12px",
          borderBottom: "1px solid var(--border-base)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <MessageCircle size={16} color="var(--accent)" />
            <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>
              New Conversation
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={onClose}
            style={{
              width: 28, height: 28, borderRadius: 8,
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-subtle)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "var(--text-muted)",
            }}
          >
            <X size={14} />
          </motion.button>
        </div>

        {/* Search input */}
        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-base)" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            padding: "9px 12px",
          }}>
            <Search size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, username or email…"
              style={{
                flex: 1, background: "transparent", border: "none",
                color: "var(--text-primary)", fontSize: 13, outline: "none",
              }}
            />
            {loading && <Loader size={13} color="var(--text-muted)" style={{ animation: "spin 0.8s linear infinite", flexShrink: 0 }} />}
            {query && !loading && (
              <motion.button
                initial={{ scale: 0.7 }} animate={{ scale: 1 }}
                onClick={() => setQuery("")}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}
              >
                <X size={13} color="var(--text-muted)" />
              </motion.button>
            )}
          </div>
        </div>

        {/* User list */}
        <div style={{ maxHeight: 340, overflowY: "auto" }}>
          {users.length === 0 && !loading && (
            <div style={{
              padding: "36px 16px", textAlign: "center",
              color: "var(--text-hint)", fontSize: 13,
            }}>
              {query ? "No users found for that search." : "No other users registered yet."}
            </div>
          )}

          {users.map((user, i) => (
            <motion.button
              key={user._id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => handleSelect(user)}
              disabled={!!creating}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12,
                padding: "11px 16px",
                background: "transparent",
                border: "none", borderBottom: "1px solid var(--border-base)",
                cursor: creating ? "wait" : "pointer",
                textAlign: "left",
                transition: "background 0.12s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-hover)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <Avatar user={user} size="md" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 13, fontWeight: 600, color: "var(--text-primary)",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {user.fullName}
                </div>
                <div style={{
                  fontSize: 11, color: "var(--text-muted)",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  @{user.username || user.email}
                </div>
              </div>
              {creating === user._id ? (
                <Loader size={14} color="var(--accent)" style={{ animation: "spin 0.8s linear infinite", flexShrink: 0 }} />
              ) : (
                <div style={{
                  fontSize: 11, color: "var(--accent)",
                  background: "var(--accent-muted)",
                  padding: "3px 8px", borderRadius: "var(--radius-full)",
                  fontWeight: 600, flexShrink: 0,
                }}>
                  Chat
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NewChatModal;
