import { motion } from "framer-motion";
import Avatar from "../common/Avatar";
import ReadReceipt from "./ReadReceipt";
import { formatTime } from "../../utils/helpers";

const MessageBubble = ({ message, isOwn, sender, showAvatar = true, isGroup = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 8, scale: 0.97 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.2, ease: "easeOut" }}
    style={{
      display: "flex",
      flexDirection: isOwn ? "row-reverse" : "row",
      alignItems: "flex-end",
      gap: 8,
    }}
  >
    {/* Avatar slot */}
    <div style={{ width: 32, flexShrink: 0 }}>
      {!isOwn && isGroup && showAvatar && sender && (
        <Avatar user={sender} size="sm" />
      )}
    </div>

    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: isOwn ? "flex-end" : "flex-start",
      maxWidth: "68%", gap: 2,
    }}>
      {/* Sender name in group */}
      {!isOwn && isGroup && showAvatar && sender && (
        <span style={{ fontSize: 11, color: sender.color || "var(--accent)", fontWeight: 600, paddingLeft: 4 }}>
          {sender.fullName}
        </span>
      )}

      {/* Image */}
      {message.image && (
        <img src={message.image} alt="attachment"
          style={{ maxWidth: 220, borderRadius: 12, objectFit: "cover", border: "1px solid var(--border-subtle)" }}
        />
      )}

      {/* Text bubble */}
      {message.text && (
        <div style={{
          padding: "9px 14px",
          borderRadius: 16,
          borderBottomRightRadius: isOwn ? 4 : 16,
          borderBottomLeftRadius:  isOwn ? 16 : 4,
          background: isOwn ? "var(--accent)" : "var(--bubble-in)",
          border: isOwn ? "none" : "1px solid var(--bubble-in-border)",
          color: isOwn ? "#fff" : "var(--text-primary)",
          fontSize: 14, lineHeight: 1.55, wordBreak: "break-word",
        }}>
          {message.text}
        </div>
      )}

      {/* Time + status */}
      <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "0 3px" }}>
        <span style={{ fontSize: 10, color: "var(--text-hint)" }}>{formatTime(message.createdAt)}</span>
        {isOwn && <ReadReceipt status={message.status} />}
      </div>
    </div>
  </motion.div>
);

export default MessageBubble;