import Room         from "../models/Room.model.js";
import Conversation  from "../models/Conversation.model.js";
import ApiError       from "../utils/ApiError.js";
import { uploadImage } from "../config/claudinary.js"

// ── GET /api/rooms ── get all rooms user is a member of
export const getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find({ members: req.user._id })
      .populate("members", "fullName avatar username status")
      .populate("admin",   "fullName avatar username")
      .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, data: rooms });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/rooms/:id ──
export const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate("members", "fullName avatar username status")
      .populate("admin",   "fullName avatar username");

    if (!room) throw new ApiError(404, "Room not found");

    const isMember = room.members.some(
      (m) => m._id.toString() === req.user._id.toString()
    );
    if (!isMember) throw new ApiError(403, "You are not a member of this room");

    res.status(200).json({ success: true, data: room });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/rooms ── create a new room
export const createRoom = async (req, res, next) => {
  try {
    const { name, description, memberIds = [], isPrivate = false, avatar } = req.body;

    if (!name) throw new ApiError(400, "Room name is required");

    let avatarUrl = "";
    if (avatar && avatar.startsWith("data:image")) {
      avatarUrl = await uploadImage(avatar, "pulsechat/rooms");
    }

    const allMembers = [req.user._id, ...memberIds];

    // Create the backing conversation
    const conversation = await Conversation.create({
      type: "group",
      name,
      participants: allMembers,
      admin: req.user._id,
    });

    const room = await Room.create({
      name,
      description,
      avatar: avatarUrl,
      admin: req.user._id,
      members: allMembers,
      conversation: conversation._id,
      isPrivate,
    });

    await room.populate("members", "fullName avatar username status");
    await room.populate("admin",   "fullName avatar username");

    res.status(201).json({ success: true, data: room });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/rooms/:id ── update room (admin only)
export const updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) throw new ApiError(404, "Room not found");

    if (room.admin.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "Only the admin can update this room");
    }

    const { name, description, isPrivate, avatar } = req.body;

    let avatarUrl = room.avatar;
    if (avatar && avatar.startsWith("data:image")) {
      avatarUrl = await uploadImage(avatar, "pulsechat/rooms");
    }

    const updated = await Room.findByIdAndUpdate(
      req.params.id,
      { name, description, isPrivate, avatar: avatarUrl },
      { new: true, runValidators: true }
    )
      .populate("members", "fullName avatar username status")
      .populate("admin",   "fullName avatar username");

    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/rooms/:id/join ──
export const joinRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) throw new ApiError(404, "Room not found");
    if (room.isPrivate) throw new ApiError(403, "This room is private");

    const alreadyMember = room.members
      .map((m) => m.toString())
      .includes(req.user._id.toString());

    if (!alreadyMember) {
      room.members.push(req.user._id);
      await room.save();

      // Also add to conversation
      await Conversation.findByIdAndUpdate(room.conversation, {
        $addToSet: { participants: req.user._id },
      });
    }

    res.status(200).json({ success: true, message: "Joined room" });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/rooms/:id/leave ──
export const leaveRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) throw new ApiError(404, "Room not found");

    room.members = room.members.filter(
      (m) => m.toString() !== req.user._id.toString()
    );
    await room.save();

    await Conversation.findByIdAndUpdate(room.conversation, {
      $pull: { participants: req.user._id },
    });

    res.status(200).json({ success: true, message: "Left room" });
  } catch (err) {
    next(err);
  }
};