import jwt  from "jsonwebtoken";
import User  from "../models/User.model.js";
import ApiError from "../utils/ApiError.js";

const protect = async (req, res, next) => {
  try {
    const token =
      req.cookies?.pulsechat_token ||
      req.headers?.authorization?.replace("Bearer ", "");

    if (!token) throw new ApiError(401, "Not authenticated — no token");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) throw new ApiError(401, "User no longer exists");

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError")  return next(new ApiError(401, "Invalid token"));
    if (err.name === "TokenExpiredError")  return next(new ApiError(401, "Token expired"));
    next(err);
  }
};

export default protect;