import User from "../models/User.model.js";
import ApiError from "../utils/ApiError.js";
import generateToken from "../utils/generateToken.js";

export const register = async (req, res, next) => {
  try {
    const { fullName, username, email, password } = req.body;
    if (!fullName || !username || !email || !password)
      throw new ApiError(400, "All fields are required");
    if (password.length < 6)
      throw new ApiError(400, "Password must be at least 6 characters");

    if (await User.findOne({ email }))
      throw new ApiError(409, "Email already in use");
    if (await User.findOne({ username }))
      throw new ApiError(409, "Username already taken");

    const user = await User.create({ fullName, username, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: { ...user.toObject(), token },
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      throw new ApiError(400, "Email and password are required");

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password)))
      throw new ApiError(401, "Invalid email or password");

    user.status = "online";
    user.lastSeen = new Date();
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: { ...user.toObject(), token },
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      status: "offline",
      lastSeen: new Date(),
    });
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: req.user });
  } catch (err) {
    next(err);
  }
};
