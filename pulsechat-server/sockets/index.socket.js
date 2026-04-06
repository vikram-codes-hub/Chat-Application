import chatSocket     from "./chat.socket.js";
import presenceSocket from "./presence.socket.js";
import roomSocket     from "./room.socket.js";
import jwt            from "jsonwebtoken";
import User           from "../models/User.model.js";

// Store online users: { userId: socketId }
export const onlineUsers = new Map();

const initSocket = (io) => {

  // ── Auth middleware for every socket connection ──
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.cookie
          ?.split(";")
          .find((c) => c.trim().startsWith("pulsechat_token="))
          ?.split("=")[1];

      // Also accept userId from query (dev / fallback)
      const { userId } = socket.handshake.query;

      if (token) {
        const decoded  = jwt.verify(token, process.env.JWT_SECRET);
        const user     = await User.findById(decoded.userId).select("-password");
        if (!user) return next(new Error("User not found"));
        socket.user   = user;
        socket.userId = user._id.toString();
      } else if (userId) {
        // Dev mode — accept raw userId
        socket.userId = userId;
      } else {
        return next(new Error("Authentication required"));
      }

      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.userId;
    console.log(`🔌 Socket connected: ${socket.id} | user: ${userId}`);

    // Track online user
    onlineUsers.set(userId, socket.id);

    // Broadcast updated online users list to everyone
    io.emit("onlineUsers", Array.from(onlineUsers.keys()));

    // Register feature handlers
    chatSocket(io, socket, onlineUsers);
    presenceSocket(io, socket, onlineUsers);
    roomSocket(io, socket, onlineUsers);

    // ── Disconnect ──
    socket.on("disconnect", () => {
      console.log(`❌ Socket disconnected: ${socket.id} | user: ${userId}`);
      onlineUsers.delete(userId);
      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    });
  });
};

export default initSocket;