import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String, required: true, trim: true, maxlength: 100,
    },
    description: {
      type: String, default: "", maxlength: 300,
    },
    avatar: {
      type: String, default: "",
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", required: true,
    },
    members: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },
    isPrivate: {
      type: Boolean, default: false,
    },
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);
export default Room;