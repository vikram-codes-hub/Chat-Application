import User           from "../models/User.model.js";
import ApiError        from "../utils/ApiError.js";
import generateToken   from "../utils/generateToken.js";

// ── POST /api/auth/register ──
export const register = async (req, res, next) => {
  try {
    const { fullName, username, email, password } = req.body;

    if (!fullName || !username || !email || !password) {
      throw new ApiError(400, "All fields are required");
    }
    if (password.length < 6) {
      throw new ApiError(400, "Password must be at least 6 characters");
    }

    const emailExists    = await User.findOne({ email });
    if (emailExists)     throw new ApiError(409, "Email already in use");

    const usernameExists = await User.findOne({ username });
    if (usernameExists)  throw new ApiError(409, "Username already taken");

    const user = await User.create({ fullName, username, email, password });

    generateToken(user._id, res);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/auth/login ──
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) throw new ApiError(400, "Email and password are required");

    const user = await User.findOne({ email }).select("+password");
    if (!user)              throw new ApiError(401, "Invalid email or password");

    const isMatch = await user.comparePassword(password);
    if (!isMatch)           throw new ApiError(401, "Invalid email or password");

    // Update status to online
    user.status   = "online";
    user.lastSeen = new Date();
    await user.save();

    generateToken(user._id, res);

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/auth/logout ──
export const logout = async (req, res, next) => {
  try {
    // Update status to offline
    await User.findByIdAndUpdate(req.user._id, {
      status: "offline",
      lastSeen: new Date(),
    });

    res.clearCookie("pulsechat_token", {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/auth/me ──
export const getMe = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: req.user });
  } catch (err) {
    next(err);
  }
};