import User from "../models/User.model.js";

const presenceSocket = (io, socket, onlineUsers) => {

  // ── User comes online ──
  socket.on("setOnline", async () => {
    try {
      await User.findByIdAndUpdate(socket.userId, {
        status: "online",
        lastSeen: new Date(),
      });

      io.emit("userStatusChanged", {
        userId: socket.userId,
        status: "online",
      });
    } catch (err) {
      console.error("setOnline error:", err.message);
    }
  });

  // ── User goes away ──
  socket.on("setAway", async () => {
    try {
      await User.findByIdAndUpdate(socket.userId, {
        status: "away",
        lastSeen: new Date(),
      });

      io.emit("userStatusChanged", {
        userId: socket.userId,
        status: "away",
      });
    } catch (err) {
      console.error("setAway error:", err.message);
    }
  });

  // ── User disconnects — mark offline ──
  socket.on("disconnect", async () => {
    try {
      await User.findByIdAndUpdate(socket.userId, {
        status:   "offline",
        lastSeen: new Date(),
      });

      io.emit("userStatusChanged", {
        userId:   socket.userId,
        status:   "offline",
        lastSeen: new Date(),
      });
    } catch (err) {
      console.error("presence disconnect error:", err.message);
    }
  });

  // ── Request current online users list ──
  socket.on("getOnlineUsers", () => {
    socket.emit("onlineUsers", Array.from(onlineUsers.keys()));
  });
};

export default presenceSocket;