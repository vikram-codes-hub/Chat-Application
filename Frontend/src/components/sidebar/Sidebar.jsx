import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MessageCircle, Users, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useChat } from "../../hooks/useChat";
import Avatar from "../common/Avatar";
import SearchBar from "./SearchBar";
import ConversationList from "./ConversationList";
import RoomList from "./RoomList";
import NewChatModal from "./NewChatModal";

const TAB = { CHATS: "chats", GROUPS: "groups" };

const Sidebar = ({ onClose }) => {
  const [search,      setSearch]      = useState("");
  const [tab,         setTab]         = useState(TAB.CHATS);
  const [showNewChat, setShowNewChat] = useState(false);
  const navigate             = useNavigate();
  const { authUser, logout } = useAuth();
  const { conversations, activeConversation, setActiveConversation, fetchConversations } = useChat();

  const directs = conversations.filter((c) => c.type === "direct");
  const groups  = conversations.filter((c) => c.type === "group");

  const filtered = (list) =>
    list.filter((c) => {
      const name = c.type === "group" ? c.name : c.participant?.fullName;
      return name?.toLowerCase().includes(search.toLowerCase());
    });

  const handleSelect = (conv) => {
    setActiveConversation(conv);
    onClose?.();
  };

  const handleStartChat = async (conv) => {
    // Refresh conversation list so the new chat appears, then select it
    await fetchConversations();
    setActiveConversation(conv);
    setShowNewChat(false);
    onClose?.();
  };

  return (
    <>
    <motion.aside
      initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{ width: 260, flexShrink: 0, background: "var(--bg-sidebar)", borderRight: "1px solid var(--border-base)", display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}
    >
      {/* Header */}
      <div style={{ padding: "14px 14px 10px", borderBottom: "1px solid var(--border-base)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="#fff">
                <circle cx="8" cy="8" r="3"/>
                <circle cx="8" cy="8" r="6.5" fill="none" stroke="#fff" strokeWidth="1.2"/>
              </svg>
            </div>
            <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>PulseChat</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.92 }}
            onClick={() => setShowNewChat(true)}
            title="New conversation"
            style={{ width: 28, height: 28, borderRadius: 8, background: "var(--accent)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Plus size={14} color="#fff" />
          </motion.button>
        </div>
        <SearchBar value={search} onChange={setSearch} />
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, padding: "8px 10px", borderBottom: "1px solid var(--border-base)" }}>
        {[
          { id: TAB.CHATS,  icon: <MessageCircle size={13} />, label: "Chats"  },
          { id: TAB.GROUPS, icon: <Users size={13} />,         label: "Groups" },
        ].map((t) => (
          <motion.button key={t.id} whileTap={{ scale: 0.96 }} onClick={() => setTab(t.id)}
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "6px 0", borderRadius: "var(--radius-sm)", background: tab === t.id ? "var(--bg-active)" : "transparent", border: `1px solid ${tab === t.id ? "var(--border-strong)" : "transparent"}`, color: tab === t.id ? "var(--accent)" : "var(--text-muted)", fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all 0.15s" }}>
            {t.icon} {t.label}
          </motion.button>
        ))}
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {tab === TAB.CHATS
          ? <ConversationList conversations={filtered(directs)} activeId={activeConversation?._id} onSelect={handleSelect} />
          : <RoomList rooms={filtered(groups)} activeId={activeConversation?._id} onSelect={handleSelect} />
        }
      </div>

      {/* Footer */}
      <div style={{ padding: "10px 14px", borderTop: "1px solid var(--border-base)", display: "flex", alignItems: "center", gap: 10 }}>
        <Avatar user={authUser} size="sm" showOnline isOnline />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{authUser?.fullName}</div>
          <div style={{ fontSize: 10, color: "#22c55e" }}>● Active</div>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {[
            { icon: <Settings size={12} />, action: () => navigate("/profile"), title: "Profile" },
            { icon: <LogOut size={12} />,   action: logout,                     title: "Logout"  },
          ].map(({ icon, action, title }) => (
            <motion.button key={title} title={title} whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }} onClick={action}
              style={{ width: 26, height: 26, borderRadius: 6, background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text-muted)" }}>
              {icon}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.aside>

    {/* New Chat Modal — rendered outside <aside> so it portal-stacks above everything */}
    {showNewChat && (
      <NewChatModal
        onClose={() => setShowNewChat(false)}
        onStartChat={handleStartChat}
      />
    )}
    </>
  );
};

export default Sidebar;