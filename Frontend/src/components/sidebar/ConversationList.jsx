import { motion, AnimatePresence } from "framer-motion";
import Avatar from "../common/Avatar";
import { formatConvTime } from "../../utils/formatTime";
import { getConvName, getConvUser } from "../../utils/helpers";
import { useSocket } from "../../hooks/useSocket";

const ConversationList = ({ conversations, activeId, onSelect }) => {
  const { isUserOnline } = useSocket() || {};

  if (!conversations.length) {
    return (
      <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--text-hint)", fontSize: 13 }}>
        No conversations yet
      </div>
    );
  }

  return (
    <AnimatePresence>
      {conversations.map((conv, i) => {
        const isActive = conv._id === activeId;
        const name     = getConvName(conv);
        const user     = getConvUser(conv);
        const online   = conv.type === "direct" && isUserOnline?.(conv.participant?._id);

        return (
          <motion.div
            key={conv._id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03, duration: 0.22 }}
            onClick={() => onSelect(conv)}
            whileHover={{ background: isActive ? "var(--bg-active)" : "var(--bg-hover)" }}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "9px 14px", cursor: "pointer",
              background: isActive ? "var(--bg-active)" : "transparent",
              borderRight: `2px solid ${isActive ? "var(--accent)" : "transparent"}`,
              transition: "background 0.12s",
            }}
          >
            <Avatar
              user={user} size="md"
              showOnline={conv.type === "direct"}
              isOnline={online}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 4 }}>
                <span style={{
                  fontSize: 13, fontWeight: 500,
                  color: isActive ? "var(--text-primary)" : "var(--text-primary)",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {name}
                </span>
                {conv.lastMessage?.createdAt && (
                  <span style={{ fontSize: 10, color: "var(--text-hint)", flexShrink: 0 }}>
                    {formatConvTime(conv.lastMessage.createdAt)}
                  </span>
                )}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
                <span style={{
                  fontSize: 11, color: "var(--text-muted)",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1,
                }}>
                  {conv.lastMessage?.text || "No messages yet"}
                </span>
                {conv.unreadCount > 0 && (
                  <span style={{
                    background: "var(--accent)", color: "#fff",
                    fontSize: 10, fontWeight: 700,
                    padding: "1px 6px", borderRadius: 10,
                    flexShrink: 0, marginLeft: 6,
                  }}>
                    {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </AnimatePresence>
  );
};

export default ConversationList;