export const mockUsers = [
  { _id: "u1", fullName: "Arjun Rao",    username: "arjunrao",   avatar: null, initials: "AR", color: "#7c6eff", status: "online",  bio: "Full-stack dev @ PulseChat" },
  { _id: "u2", fullName: "Priya Shah",   username: "priyashah",  avatar: null, initials: "PS", color: "#22c55e", status: "online",  bio: "UI/UX Designer" },
  { _id: "u3", fullName: "Karan Mehta",  username: "karanm",     avatar: null, initials: "KM", color: "#f97316", status: "away",    bio: "Backend engineer" },
  { _id: "u4", fullName: "Sneha Reddy",  username: "snehar",     avatar: null, initials: "SR", color: "#60a5fa", status: "online",  bio: "DevOps @ cloud" },
  { _id: "u5", fullName: "Nisha Verma",  username: "nishav",     avatar: null, initials: "NV", color: "#e879f9", status: "offline", bio: "Product manager" },
  { _id: "u6", fullName: "Rahul Gupta",  username: "rahulg",     avatar: null, initials: "RG", color: "#fb7185", status: "online",  bio: "ML Engineer" },
];

export const mockAuthUser = {
  _id: "me",
  fullName: "Vikram Kumar",
  username: "vikramk",
  avatar: null,
  initials: "VK",
  color: "#7c6eff",
  status: "online",
  bio: "Building PulseChat 🚀",
  email: "vikram@pulsechat.io",
};

export const mockConversations = [
  {
    _id: "c1", type: "direct",
    participant: mockUsers[0],
    lastMessage: { text: "sounds good! 🔥", createdAt: "2026-04-05T10:46:00Z", senderId: "u1" },
    unreadCount: 3,
  },
  {
    _id: "c2", type: "direct",
    participant: mockUsers[1],
    lastMessage: { text: "Can you review the PR?", createdAt: "2026-04-05T09:30:00Z", senderId: "u2" },
    unreadCount: 0,
  },
  {
    _id: "c3", type: "direct",
    participant: mockUsers[2],
    lastMessage: { text: "Meeting at 4pm today", createdAt: "2026-04-05T08:00:00Z", senderId: "u3" },
    unreadCount: 0,
  },
  {
    _id: "c4", type: "group",
    name: "Dev Team",
    initials: "DT",
    color: "#60a5fa",
    participants: mockUsers,
    lastMessage: { text: "Sneha: pushed the hotfix", createdAt: "2026-04-05T11:00:00Z", senderId: "u4" },
    unreadCount: 12,
  },
  {
    _id: "c5", type: "direct",
    participant: mockUsers[4],
    lastMessage: { text: "Thanks for the update!", createdAt: "2026-04-04T18:00:00Z", senderId: "u5" },
    unreadCount: 0,
  },
];

export const mockMessages = {
  c1: [
    { _id: "m1", senderId: "u1", text: "Hey! How's the PulseChat backend coming along?", createdAt: "2026-04-05T10:42:00Z", status: "seen" },
    { _id: "m2", senderId: "me", text: "Going great! Socket.io setup is done 🚀", createdAt: "2026-04-05T10:44:00Z", status: "seen" },
    { _id: "m3", senderId: "me", text: "Auth routes are next on the list", createdAt: "2026-04-05T10:44:30Z", status: "seen" },
    { _id: "m4", senderId: "u1", text: "Nice! Are you using JWT or sessions?", createdAt: "2026-04-05T10:45:00Z", status: "seen" },
    { _id: "m5", senderId: "me", text: "JWT with httpOnly cookies 🔐", createdAt: "2026-04-05T10:46:00Z", status: "seen" },
    { _id: "m6", senderId: "u1", text: "sounds good! 🔥", createdAt: "2026-04-05T10:47:00Z", status: "seen" },
  ],
  c2: [
    { _id: "m7",  senderId: "u2", text: "Hey Vikram, pushed a new component for the sidebar", createdAt: "2026-04-05T09:00:00Z", status: "seen" },
    { _id: "m8",  senderId: "me", text: "Looks clean! Will review after standup", createdAt: "2026-04-05T09:15:00Z", status: "seen" },
    { _id: "m9",  senderId: "u2", text: "Can you review the PR?", createdAt: "2026-04-05T09:30:00Z", status: "delivered" },
  ],
  c4: [
    { _id: "m10", senderId: "u4", text: "Morning team! Daily standup in 5 mins", createdAt: "2026-04-05T09:55:00Z", status: "seen" },
    { _id: "m11", senderId: "u1", text: "On my way!", createdAt: "2026-04-05T09:56:00Z", status: "seen" },
    { _id: "m12", senderId: "me", text: "Be there in 2", createdAt: "2026-04-05T09:57:00Z", status: "seen" },
    { _id: "m13", senderId: "u4", text: "pushed the hotfix", createdAt: "2026-04-05T11:00:00Z", status: "delivered" },
  ],
};