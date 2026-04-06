import Conversation from "../models/Conversation.model.js";
import User         from "../models/User.model.js";
import ApiError      from "../utils/ApiError.js";

// ── GET /api/conversations ── get all conversations for logged-in user
export const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate("participants", "-password")
      .populate({
        path: "lastMessage",
        populate: { path: "senderId", select: "fullName avatar" },
      })
      .sort({ updatedAt: -1 });

    // Shape response to match frontend expectations
    const shaped = conversations.map((conv) => {
      const obj = conv.toObject();

      // For direct chats, set participant = the other user
      if (conv.type === "direct") {
        obj.participant = conv.participants.find(
          (p) => p._id.toString() !== req.user._id.toString()
        );
      }

      // Unread count for current user
      obj.unreadCount = conv.unreadCounts?.get?.(req.user._id.toString()) || 0;

      return obj;
    });

    res.status(200).json({ success: true, data: shaped });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/conversations ── create or get existing direct conversation
export const createConversation = async (req, res, next) => {
  try {
    const { participantId } = req.body;
    if (!participantId) throw new ApiError(400, "participantId is required");

    const otherUser = await User.findById(participantId);
    if (!otherUser) throw new ApiError(404, "User not found");

    // Check if direct conversation already exists
    let conversation = await Conversation.findOne({
      type: "direct",
      participants: { $all: [req.user._id, participantId] },
    })
      .populate("participants", "-password")
      .populate("lastMessage");

    if (conversation) {
      const obj         = conversation.toObject();
      obj.participant   = otherUser;
      obj.unreadCount   = conversation.unreadCounts?.get?.(req.user._id.toString()) || 0;
      return res.status(200).json({ success: true, data: obj });
    }

    // Create new direct conversation
    conversation = await Conversation.create({
      type: "direct",
      participants: [req.user._id, participantId],
    });

    await conversation.populate("participants", "-password");

    const obj       = conversation.toObject();
    obj.participant = otherUser;
    obj.unreadCount = 0;

    res.status(201).json({ success: true, data: obj });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/conversations/group ── create group conversation
export const createGroupConversation = async (req, res, next) => {
  try {
    const { name, participantIds } = req.body;

    if (!name)                          throw new ApiError(400, "Group name is required");
    if (!participantIds?.length)        throw new ApiError(400, "At least one participant required");
    if (participantIds.length < 2)      throw new ApiError(400, "Group needs at least 2 other members");

    const allParticipants = [req.user._id, ...participantIds];

    const conversation = await Conversation.create({
      type: "group",
      name,
      participants: allParticipants,
      admin: req.user._id,
    });

    await conversation.populate("participants", "-password");

    res.status(201).json({ success: true, data: conversation });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/conversations/:id ── leave / delete conversation
export const deleteConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) throw new ApiError(404, "Conversation not found");

    const isMember = conversation.participants
      .map((p) => p.toString())
      .includes(req.user._id.toString());

    if (!isMember) throw new ApiError(403, "Not a member of this conversation");

    // For direct chats — delete entirely
    // For group chats — remove participant
    if (conversation.type === "direct") {
      await conversation.deleteOne();
    } else {
      conversation.participants = conversation.participants.filter(
        (p) => p.toString() !== req.user._id.toString()
      );
      await conversation.save();
    }

    res.status(200).json({ success: true, message: "Conversation removed" });
  } catch (err) {
    next(err);
  }
};