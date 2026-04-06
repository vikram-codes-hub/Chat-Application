import { format, isToday, isYesterday, formatDistanceToNow } from "date-fns";

export const formatTime = (dateStr) => {
  const date = new Date(dateStr);
  return format(date, "hh:mm a");
};

export const formatConvTime = (dateStr) => {
  const date = new Date(dateStr);
  if (isToday(date))     return format(date, "hh:mm a");
  if (isYesterday(date)) return "Yesterday";
  return format(date, "dd/MM/yy");
};

export const formatDateDivider = (dateStr) => {
  const date = new Date(dateStr);
  if (isToday(date))     return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMMM d, yyyy");
};

export const formatRelative = (dateStr) =>
  formatDistanceToNow(new Date(dateStr), { addSuffix: true });

export const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

export const avatarColors = [
  "#7c6eff", "#22c55e", "#f97316", "#60a5fa",
  "#e879f9", "#fb7185", "#34d399", "#facc15",
];

export const getAvatarColor = (str = "") => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
};

export const groupMessagesByDate = (messages = []) => {
  const groups = [];
  let lastDate = null;
  messages.forEach((msg) => {
    const date = formatDateDivider(msg.createdAt);
    if (date !== lastDate) {
      groups.push({ type: "divider", date });
      lastDate = date;
    }
    groups.push({ type: "message", ...msg });
  });
  return groups;
};

export const getConvName = (conv = {}) => {
  if (conv.type === "direct" && conv.participant) {
    return conv.participant.fullName || conv.participant.username || "Unknown User";
  }
  return conv.name || "Conversation";
};

export const getConvUser = (conv = {}) => {
  if (conv.type === "direct" && conv.participant) {
    return conv.participant;
  }
  // For group chats, return the conv itself so the Avatar can use its name/image
  return {
    ...conv,
    name: conv.name || "Group",
    isGroup: true
  };
};