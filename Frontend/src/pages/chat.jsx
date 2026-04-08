import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, Video, MoreVertical } from "lucide-react";
import { useChat } from "../hooks/useChat";
import { useSocket } from "../hooks/useSocket";
import { useAuth } from "../hooks/useAuth";
import Sidebar from "../components/sidebar/Sidebar";
import ChatWindow from "../components/chat/ChatWindow";
import MessageInput from "../components/chat/MessageInput";
import Avatar from "../components/common/Avatar";
import { getConvName, getConvUser } from "../utils/helpers";

/* ── Chat header (inside chat area) ── */
const ChatAreaHeader = ({ conversation }) => {
  const { isUserOnline } = useSocket() || {};
  const { isTypingInConv } = useChat();

  const isGroup   = conversation?.type === "group";
  const name      = getConvName(conversation);
  const user      = getConvUser(conversation);
  const online    = !isGroup && isUserOnline?.(conversation?.participant?._id);
  const typing    = isTypingInConv(conversation?._id);

  const statusText  = typing ? "typing..." : isGroup ? `${conversation?.participants?.length || 0} members` : online ? "Online" : "Offline";
  const statusColor = typing ? "var(--accent)" : online && !isGroup ? "#22c55e" : "var(--text-muted)";

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "12px 18px",
      background: "var(--bg-header)",
      borderBottom: "1px solid var(--border-base)",
      flexShrink: 0,
    }}>
      <Avatar user={user} size="md" showOnline={!isGroup} isOnline={online} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>{name}</div>
        <motion.div key={statusText} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: 11, color: statusColor }}>
          {statusText}
        </motion.div>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {[<Phone size={14} />, <Video size={14} />, <MoreVertical size={14} />].map((icon, i) => (
          <motion.button key={i} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            style={{
              width: 32, height: 32, borderRadius: "var(--radius-sm)",
              background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "var(--text-muted)",
            }}>
            {icon}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

/* ── Empty state ── */
const NoChatSelected = () => (
  <div style={{
    flex: 1, display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", gap: 14,
  }}>
    <motion.div
      animate={{ scale: [1, 1.08, 1], opacity: [0.08, 0.16, 0.08] }}
      transition={{ duration: 3, repeat: Infinity }}
      style={{ width: 72, height: 72, borderRadius: 22, background: "var(--accent)" }}
    />
    <div style={{ textAlign: "center" }}>
      <p style={{ fontSize: 16, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 4 }}>
        Welcome to PulseChat
      </p>
      <p style={{ fontSize: 13, color: "var(--text-hint)" }}>
        Pick a conversation from the sidebar to start chatting
      </p>
    </div>
  </div>
);

 
const Chat = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { activeConversation,conversations, receiveMessage, setTyping, fetchConversations } = useChat();
  const { socket, joinConversation, leaveConversation } = useSocket() || {};
   const freshConversation = conversations.find(c => c._id === activeConversation?._id) || activeConversation;


  useEffect(() => { fetchConversations(); }, []); 

  useEffect(() => {
    if (!socket) return;
    const onNewMessage  = (msg)                          => receiveMessage(msg);
    const onTyping      = ({ conversationId, userId })   => setTyping(conversationId, userId, true);
    const onStopTyping  = ({ conversationId, userId })   => setTyping(conversationId, userId, false);
    socket.on("newMessage",  onNewMessage);
    socket.on("typing",      onTyping);
    socket.on("stopTyping",  onStopTyping);
    return () => {
      socket.off("newMessage",  onNewMessage);
      socket.off("typing",      onTyping);
      socket.off("stopTyping",  onStopTyping);
    };
  }, [socket, receiveMessage, setTyping]);

 
  useEffect(() => {
    if (!activeConversation?._id || !socket) return;
    joinConversation?.(activeConversation._id);
    return () => leaveConversation?.(activeConversation._id);
  }, [activeConversation?._id, socket]); 

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--bg-base)" }}>

      {/* ── Sidebar: always visible on desktop, drawer on mobile ── */}
      {/* Desktop */}
      <div className="desktop-sidebar">
        <Sidebar />
      </div>

      {/* Mobile drawer overlay */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              style={{
                position: "fixed", inset: 0, zIndex: 40,
                background: "rgba(0,0,0,0.55)",
              }}
            />
            <motion.div
              key="drawer"
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              style={{
                position: "fixed", top: 0, left: 0, bottom: 0,
                width: 280, zIndex: 50,
                display: "flex",
              }}
            >
              <Sidebar onClose={() => setDrawerOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Chat area ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Mobile top bar with hamburger */}
        <div className="mobile-topbar" style={{
          display: "none",
          alignItems: "center", gap: 10,
          padding: "10px 16px",
          background: "var(--bg-header)",
          borderBottom: "1px solid var(--border-base)",
          flexShrink: 0,
        }}>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setDrawerOpen(true)}
            style={{
              width: 34, height: 34, borderRadius: "var(--radius-sm)",
              background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <Menu size={16} color="var(--text-muted)" />
          </motion.button>
          {activeConversation && (
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
              {getConvName(freshConversation)}
            </span>
          )}
        </div>

        {activeConversation ? (
          <>
            <div className="desktop-chat-header">
              <ChatAreaHeader conversation={freshConversation} />
            </div>
            <ChatWindow />
            <MessageInput conversationId={freshConversation._id} />
          </>
        ) : (
          <NoChatSelected />
        )}
      </div>

      {/* ── Responsive styles ── */}
      <style>{`
        @media (max-width: 640px) {
          .desktop-sidebar      { display: none !important; }
          .desktop-chat-header  { display: none !important; }
          .mobile-topbar        { display: flex !important; }
        }
        @media (min-width: 641px) {
          .mobile-topbar { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Chat;