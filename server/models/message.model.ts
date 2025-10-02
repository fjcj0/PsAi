import mongoose from "mongoose";
const messageSchema = new mongoose.Schema(
    {
        conversationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        role: {
            type: String,
            enum: ["user", "ai"],
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
            default: false
        },
    },
    { timestamps: true }
);
export const Message = mongoose.model("Message", messageSchema);