import mongoose, { Schema, model, models } from "mongoose";

const ChatSchema = new Schema(
  {
    userEmail: {
      type: String,
      required: true,
      unique: true,
    },
    // New fields for Rate Limiting
    usageCount: { 
      type: Number, 
      default: 0 
    },
    cycleStartDate: { 
      type: Date, 
      default: Date.now 
    },
    messages: [
      {
        role: { type: String, required: true },
        content: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

const Chat = models.Chat || model("Chat", ChatSchema);

export default Chat;