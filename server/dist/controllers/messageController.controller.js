"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessagesByConversation = exports.deleteConversation = exports.conversationsOfUser = void 0;
const conversation_model_1 = require("../models/conversation.model");
const message_model_1 = require("../models/message.model");
const mongoose_1 = __importDefault(require("mongoose"));
const conversationsOfUser = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId)
            return res.status(400).json({ message: "userId is required!" });
        const conversations = await conversation_model_1.Conversation.find({ userId });
        if (!conversations.length) {
            return res.status(200).json({ message: "This user doesn’t have any conversations yet!" });
        }
        return res.status(200).json({ conversations });
    }
    catch (error) {
        return res.status(500).json({ message: error instanceof Error ? error.message : String(error) });
    }
};
exports.conversationsOfUser = conversationsOfUser;
const deleteConversation = async (req, res) => {
    try {
        const { userId, conversationId } = req.params;
        if (!userId || !conversationId) {
            return res.status(400).json({ message: "userId and conversationId are required!" });
        }
        const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
        const conversationObjectId = new mongoose_1.default.Types.ObjectId(conversationId);
        const deletedConversation = await conversation_model_1.Conversation.deleteOne({
            userId: userObjectId,
            _id: conversationObjectId,
        });
        if (deletedConversation.deletedCount === 0) {
            return res.status(404).json({ message: "Conversation not found" });
        }
        await message_model_1.Message.deleteMany({ conversationId: conversationObjectId });
        return res.status(200).json({ message: "Conversation and its messages deleted successfully!" });
    }
    catch (error) {
        return res.status(500).json({ message: error instanceof Error ? error.message : String(error) });
    }
};
exports.deleteConversation = deleteConversation;
const getMessagesByConversation = async (req, res) => {
    try {
        const { userId, conversationId } = req.params;
        if (!userId || !conversationId) {
            return res.status(400).json({ message: "userId and conversationId are required!" });
        }
        const conversationDoc = await conversation_model_1.Conversation.findById(conversationId);
        if (!conversationDoc) {
            return res.status(404).json({ message: "Conversation not found!" });
        }
        if (conversationDoc.userId.toString() !== userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const messages = await message_model_1.Message.find({ conversationId: conversationDoc._id }).sort({ createdAt: 1 });
        return res.status(200).json({
            conversationId: conversationDoc._id,
            messages: messages.length ? messages : [],
            message: messages.length ? "Messages fetched" : "No messages yet",
        });
    }
    catch (error) {
        return res.status(500).json({ message: error instanceof Error ? error.message : String(error) });
    }
};
exports.getMessagesByConversation = getMessagesByConversation;
