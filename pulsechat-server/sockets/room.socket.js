import Room         from "../models/Room.model.js";
import Conversation  from "../models/Conversation.model.js";

const roomSocket = (io, socket, onlineUsers) => {

  // ── Join a room's socket channel ──
  socket.on("joinRoom", async ({ roomId }) => {
    try {
      const room = await Room.findById(roomId);
      if (!room) return socket.emit("roomError", { message: "Room not found" });

      const isMember = room.members
        .map((m) => m.toString())
        .includes(socket.userId);

      if (!isMember) return socket.emit("roomError", { message: "Not a member" });

      socket.join(`room:${roomId}`);
      console.log(`🏠 ${socket.userId} joined room channel: ${roomId}`);

      // Also join the underlying conversation room
      if (room.conversation) {
        socket.join(room.conversation.toString());
      }

      socket.emit("roomJoined", { roomId });
    } catch (err) {
      console.error("joinRoom error:", err.message);
    }
  });

  // ── Leave a room's socket channel ──
  socket.on("leaveRoom", async ({ roomId }) => {
    try {
      socket.leave(`room:${roomId}`);
      socket.emit("roomLeft", { roomId });
    } catch (err) {
      console.error("leaveRoom error:", err.message);
    }
  });

  // ── Add a member to a room (admin only) ──
  socket.on("addMember", async ({ roomId, userId }) => {
    try {
      const room = await Room.findById(roomId);
      if (!room) return;

      const isAdmin = room.admin.toString() === socket.userId;
      if (!isAdmin) return socket.emit("roomError", { message: "Admin only" });

      const alreadyMember = room.members
        .map((m) => m.toString())
        .includes(userId);

      if (!alreadyMember) {
        room.members.push(userId);
        await room.save();

        await Conversation.findByIdAndUpdate(room.conversation, {
          $addToSet: { participants: userId },
        });
      }

      // Notify the new member if they're online
      const newMemberSocketId = onlineUsers.get(userId);
      if (newMemberSocketId) {
        io.to(newMemberSocketId).emit("addedToRoom", { roomId });
      }

      // Notify everyone in the room
      io.to(`room:${roomId}`).emit("memberAdded", { roomId, userId });
    } catch (err) {
      console.error("addMember error:", err.message);
    }
  });

  // ── Remove a member (admin only) ──
  socket.on("removeMember", async ({ roomId, userId }) => {
    try {
      const room = await Room.findById(roomId);
      if (!room) return;

      const isAdmin = room.admin.toString() === socket.userId;
      if (!isAdmin) return socket.emit("roomError", { message: "Admin only" });

      room.members = room.members.filter((m) => m.toString() !== userId);
      await room.save();

      await Conversation.findByIdAndUpdate(room.conversation, {
        $pull: { participants: userId },
      });

      // Notify the removed member
      const removedSocketId = onlineUsers.get(userId);
      if (removedSocketId) {
        io.to(removedSocketId).emit("removedFromRoom", { roomId });
      }

      io.to(`room:${roomId}`).emit("memberRemoved", { roomId, userId });
    } catch (err) {
      console.error("removeMember error:", err.message);
    }
  });
};

export default roomSocket;