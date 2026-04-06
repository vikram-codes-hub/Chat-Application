import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useChat } from "../../hooks/useChat";
import { useAuth } from "../../hooks/useAuth";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import Spinner from "../common/Spinner";
import { groupMessagesByDate } from "../../utils/helpers";

const DateDivider = ({ date }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 10,
    padding: "6px 0", userSelect: "none",
  }}>
    <div style={{ flex: 1, height: 1, background: "var(--border-base)" }} />
    <span style={{ fontSize: 11, color: "var(--text-hint)", whiteSpace: "nowrap" }}>{date}</span>
    <div style={{ flex: 1, height: 1, background: "var(--border-base)" }} />
  </div>
);

const EmptyChat = () => (
  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
    <motion.div
      animate={{ scale: [1, 1.08, 1], opacity: [0.08, 0.14, 0.08] }}
      transition={{ duration: 3, repeat: Infinity }}
      style={{ width: 64, height: 64, borderRadius: 20, background: "var(--accent)" }}
    />
    <p style={{ fontSize: 13, color: "var(--text-hint)" }}>No messages yet — say hello!</p>
  </div>
);

const ChatWindow = () => {
  const { messages, activeConversation, isLoadingMessages, isTypingInConv } = useChat();
  const { authUser } = useAuth();
  const bottomRef = useRef(null);
  const isGroup   = activeConversation?.type === "group";
  const isTyping  = isTypingInConv(activeConversation?._id);
  const grouped   = groupMessagesByDate(messages);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (isLoadingMessages) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Spinner />
      </div>
    );
  }

  if (!messages.length) return <EmptyChat />;

  const enriched = grouped.map((item, idx) => {
    if (item.type === "divider") return item;
    const next = grouped[idx + 1];
    const showAvatar = !next || next.type === "divider" || next.senderId !== item.senderId;
    return { ...item, showAvatar };
  });

  const getSender = (senderId) => {
    if (!isGroup) return activeConversation?.participant;
    return activeConversation?.participants?.find((p) => p._id === senderId);
  };

  return (
    <div style={{
      flex: 1, overflowY: "auto",
      padding: "16px 20px",
      display: "flex", flexDirection: "column", gap: 4,
    }}>
      {enriched.map((item, i) =>
        item.type === "divider" ? (
          <DateDivider key={`div-${i}`} date={item.date} />
        ) : (
          <MessageBubble
            key={item._id}
            message={item}
            isOwn={
              item.senderId === "me" ||
              (item.senderId?._id || item.senderId) === authUser?._id
            }
            sender={getSender(item.senderId?._id || item.senderId)}
            showAvatar={item.showAvatar}
            isGroup={isGroup}
          />
        )
      )}
      <TypingIndicator
        show={isTyping}
        userName={!isGroup ? activeConversation?.participant?.fullName?.split(" ")[0] : null}
      />
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatWindow;