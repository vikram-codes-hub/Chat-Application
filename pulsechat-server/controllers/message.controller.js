import Message      from "../models/Message.model.js";
import Conversation  from "../models/Conversation.model.js";
import ApiError       from "../utils/ApiError.js";
import { uploadImage } from "../config/claudinary.js"
import { onlineUsers } from "../sockets/index.socket.js";

// ── GET /api/messages/:conversationId ── get all messages
export const getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) throw new ApiError(404, "Conversation not found");

    const isMember = conversation.participants
      .map((p) => p.toString())
      .includes(req.user._id.toString());
    if (!isMember) throw new ApiError(403, "Access denied");

    const messages = await Message.find({
      conversationId,
      deletedFor: { $ne: req.user._id },
    })
      .populate("senderId", "fullName avatar username")
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({ success: true, data: messages });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/messages/:conversationId ── send a message
export const sendMessage = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { text, image }    = req.body;

    if (!text && !image) throw new ApiError(400, "Message must have text or image");

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) throw new ApiError(404, "Conversation not found");

    const isMember = conversation.participants
      .map((p) => p.toString())
      .includes(req.user._id.toString());
    if (!isMember) throw new ApiError(403, "Access denied");

    let imageUrl = "";
    if (image && image.startsWith("data:image")) {
      imageUrl = await uploadImage(image, "pulsechat/messages");
    }

    const message = await Message.create({
      conversationId,
      senderId: req.user._id,
      text: text?.trim() || "",
      image: imageUrl,
      status: "sent",
    });

    await message.populate("senderId", "fullName avatar username");

    // Update conversation lastMessage + unread counts for all OTHER participants
    const unreadUpdates = {};
    conversation.participants.forEach((participantId) => {
      if (participantId.toString() !== req.user._id.toString()) {
        const key = participantId.toString();
        unreadUpdates[`unreadCounts.${key}`] =
          (conversation.unreadCounts?.get?.(key) || 0) + 1;
      }
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
      ...unreadUpdates,
    });

    // ── Emit real-time event via Socket.IO ──
    const io = req.app.locals.io;
    if (io) {
      const msgObj = message.toObject();

      // Broadcast to everyone already in the conversation socket room
      io.to(conversationId).emit("newMessage", msgObj);

      // Also deliver directly to online participants NOT already in the room
      const roomSockets = io.sockets.adapter.rooms.get(conversationId) || new Set();
      conversation.participants.forEach((participantId) => {
        const pid = participantId.toString();
        if (pid === req.user._id.toString()) return; // skip sender
        const recipientSocketId = onlineUsers.get(pid);
        if (recipientSocketId && !roomSockets.has(recipientSocketId)) {
          io.to(recipientSocketId).emit("newMessage", msgObj);
        }
      });
    }

    res.status(201).json({ success: true, data: message });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/messages/:messageId/seen ── mark message as seen
export const markAsSeen = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.messageId);
    if (!message) throw new ApiError(404, "Message not found");

    if (!message.seenBy.includes(req.user._id)) {
      message.seenBy.push(req.user._id);
      message.status = "seen";
      await message.save();
    }

    // Reset unread count for this user in the conversation
    await Conversation.findByIdAndUpdate(message.conversationId, {
      [`unreadCounts.${req.user._id}`]: 0,
    });

    res.status(200).json({ success: true, data: message });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/messages/:messageId ── delete message for self
export const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.messageId);
    if (!message) throw new ApiError(404, "Message not found");

    const isOwner = message.senderId.toString() === req.user._id.toString();
    if (!isOwner) throw new ApiError(403, "You can only delete your own messages");

    message.deletedFor.push(req.user._id);
    await message.save();

    res.status(200).json({ success: true, message: "Message deleted" });
  } catch (err) {
    next(err);
  }
};