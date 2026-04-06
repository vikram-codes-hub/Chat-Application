import mongoose from "mongoose";
import bcrypt    from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String, required: true, trim: true,
    },
    username: {
      type: String, required: true, unique: true,
      trim: true, lowercase: true,
      minlength: 3, maxlength: 30,
    },
    email: {
      type: String, required: true, unique: true,
      trim: true, lowercase: true,
    },
    password: {
      type: String, required: true, minlength: 6, select: false,
    },
    avatar: {
      type: String, default: "",
    },
    bio: {
      type: String, default: "", maxlength: 200,
    },
    status: {
      type: String,
      enum: ["online", "away", "offline"],
      default: "offline",
    },
    lastSeen: {
      type: Date, default: Date.now,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove sensitive fields from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model("User", userSchema);
export default User;