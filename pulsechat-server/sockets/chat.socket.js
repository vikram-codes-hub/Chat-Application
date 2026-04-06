import Message      from "../models/Message.model.js";
import Conversation  from "../models/Conversation.model.js";
import { uploadImage } from "../config/claudinary.js"

const chatSocket = (io, socket, onlineUsers) => {

  // ── Join conversation rooms ──
  socket.on("joinConversation", ({ conversationId }) => {
    socket.join(conversationId);
    console.log(`👥 ${socket.userId} joined conversation: ${conversationId}`);
  });

  socket.on("leaveConversation", ({ conversationId }) => {
    socket.leave(conversationId);
  });

  // ── Send message ──
  socket.on("sendMessage", async ({ conversationId, text, image, tempId }) => {
    try {
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) return;

      const isMember = conversation.participants
        .map((p) => p.toString())
        .includes(socket.userId);
      if (!isMember) return;

      let imageUrl = "";
      if (image && image.startsWith("data:image")) {
        imageUrl = await uploadImage(image, "pulsechat/messages");
      }

      const message = await Message.create({
        conversationId,
        senderId: socket.userId,
        text:     text?.trim() || "",
        image:    imageUrl,
        status:   "sent",
      });

      await message.populate("senderId", "fullName avatar username");

      // Update unread counts for other participants
      const unreadUpdates = {};
      conversation.participants.forEach((participantId) => {
        if (participantId.toString() !== socket.userId) {
          const key = participantId.toString();
          unreadUpdates[`unreadCounts.${key}`] =
            (conversation.unreadCounts?.get?.(key) || 0) + 1;
        }
      });

      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: message._id,
        ...unreadUpdates,
      });

      // Emit to everyone in the conversation room (including sender)
      io.to(conversationId).emit("newMessage", {
        ...message.toObject(),
        tempId, // so sender can replace optimistic message
      });

      // Also notify participants who are online but NOT already in the room.
      // Checking the room membership prevents delivering the message twice
      // to users who called joinConversation (they already got it above).
      const roomSockets = io.sockets.adapter.rooms.get(conversationId) || new Set();
      conversation.participants.forEach((participantId) => {
        const pid = participantId.toString();
        if (pid === socket.userId) return; // sender already handled
        const recipientSocketId = onlineUsers.get(pid);
        if (recipientSocketId && !roomSockets.has(recipientSocketId)) {
          // Recipient is online but not in the room — deliver directly
          io.to(recipientSocketId).emit("newMessage", message.toObject());
        }
      });

    } catch (err) {
      console.error("sendMessage error:", err.message);
      socket.emit("messageError", { tempId, error: "Failed to send message" });
    }
  });

  // ── Typing indicators ──
  socket.on("typing", ({ conversationId }) => {
    socket.to(conversationId).emit("typing", {
      conversationId,
      userId: socket.userId,
    });
  });

  socket.on("stopTyping", ({ conversationId }) => {
    socket.to(conversationId).emit("stopTyping", {
      conversationId,
      userId: socket.userId,
    });
  });

  // ── Read receipts ──
  socket.on("markSeen", async ({ conversationId, messageId }) => {
    try {
      const message = await Message.findById(messageId);
      if (!message) return;

      const alreadySeen = message.seenBy
        .map((id) => id.toString())
        .includes(socket.userId);

      if (!alreadySeen) {
        message.seenBy.push(socket.userId);
        message.status = "seen";
        await message.save();

        // Reset unread count for this user
        await Conversation.findByIdAndUpdate(conversationId, {
          [`unreadCounts.${socket.userId}`]: 0,
        });
      }

      // Notify the sender their message was seen
      io.to(conversationId).emit("messageSeen", {
        messageId,
        conversationId,
        seenBy: socket.userId,
      });
    } catch (err) {
      console.error("markSeen error:", err.message);
    }
  });
};

export default chatSocket;