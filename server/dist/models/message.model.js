"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const messageSchema = new mongoose_1.default.Schema({
    conversationId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true,
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
        default: '',
        required: false,
    },
}, { timestamps: true });
exports.Message = mongoose_1.default.model("Message", messageSchema);
