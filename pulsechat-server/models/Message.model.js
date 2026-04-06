import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      default: "",
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["sending", "sent", "delivered", "seen", "failed"],
      default: "sent",
    },
    seenBy: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],
    deletedFor: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;