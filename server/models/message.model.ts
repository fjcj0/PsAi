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
            required: false,
        },
        imageUrl: {
            type: String,
            required: true,
            default: '',
        },
    },
    { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
