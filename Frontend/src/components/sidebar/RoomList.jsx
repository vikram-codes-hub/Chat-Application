import { motion } from "framer-motion";
import Avatar from "../common/Avatar";
import { formatConvTime } from "../../utils/formatTime";

const RoomList = ({ rooms, activeId, onSelect }) => {
  if (!rooms.length) {
    return (
      <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--text-hint)", fontSize: 13 }}>
        No group chats yet
      </div>
    );
  }

  return (
    <>
      {rooms.map((room, i) => {
        const isActive = room._id === activeId;
        return (
          <motion.div
            key={room._id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04, duration: 0.22 }}
            onClick={() => onSelect(room)}
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
              user={{ fullName: room.name, initials: room.initials, color: room.color }}
              size="md"
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {room.name}
                </span>
                {room.lastMessage?.createdAt && (
                  <span style={{ fontSize: 10, color: "var(--text-hint)", flexShrink: 0 }}>
                    {formatConvTime(room.lastMessage.createdAt)}
                  </span>
                )}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
                <span style={{ fontSize: 11, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                  {room.participants?.length} members · {room.lastMessage?.text || "No messages yet"}
                </span>
                {room.unreadCount > 0 && (
                  <span style={{
                    background: "var(--accent)", color: "#fff",
                    fontSize: 10, fontWeight: 700,
                    padding: "1px 6px", borderRadius: 10,
                    flexShrink: 0, marginLeft: 6,
                  }}>
                    {room.unreadCount > 9 ? "9+" : room.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </>
  );
};

export default RoomList;