import User           from "../models/User.model.js";
import ApiError        from "../utils/ApiError.js";
import { uploadImage } from "../config/claudinary.js"

// ── GET /api/users ── search / get all users except self
export const getUsers = async (req, res, next) => {
  try {
    const { search } = req.query;

    const query = { _id: { $ne: req.user._id } };

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
        { email:    { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query).select("-password").limit(20);
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/users/:id ──
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) throw new ApiError(404, "User not found");
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/users/profile ──
export const updateProfile = async (req, res, next) => {
  try {
    const { fullName, username, bio, avatar } = req.body;

    if (username && username !== req.user.username) {
      const exists = await User.findOne({ username });
      if (exists) throw new ApiError(409, "Username already taken");
    }

    let avatarUrl = req.user.avatar;
    if (avatar && avatar.startsWith("data:image")) {
      avatarUrl = await uploadImage(avatar, "pulsechat/avatars");
    }

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { fullName, username, bio, avatar: avatarUrl },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/users/status ──
export const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ["online", "away", "offline"];
    if (!allowed.includes(status)) throw new ApiError(400, "Invalid status value");

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { status, lastSeen: new Date() },
      { new: true }
    ).select("-password");

    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};