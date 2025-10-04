import { Request, Response } from "express";
import { Conversation } from "../models/conversation.model";
import { Message } from "../models/message.model";
import mongoose from "mongoose";

export const conversationsOfUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.query;
        if (!userId) return res.status(400).json({ message: "userId is required!" });
        const conversations = await Conversation.find({ userId });
        if (!conversations.length) {
            return res.status(200).json({ message: "This user doesn’t have any conversations yet!" });
        }
        return res.status(200).json({ conversations });
    } catch (error) {
        return res.status(500).json({ message: error instanceof Error ? error.message : String(error) });
    }
};

export const deleteConversation = async (req: Request, res: Response) => {
    try {
        const { userId, conversationId } = req.params;
        if (!userId || !conversationId) {
            return res.status(400).json({ message: "userId and conversationId are required!" });
        }
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const conversationObjectId = new mongoose.Types.ObjectId(conversationId);
        const deletedConversation = await Conversation.deleteOne({
            userId: userObjectId,
            _id: conversationObjectId,
        });
        if (deletedConversation.deletedCount === 0) {
            return res.status(404).json({ message: "Conversation not found" });
        }
        await Message.deleteMany({ conversationId: conversationObjectId });
        return res.status(200).json({ message: "Conversation and its messages deleted successfully!" });
    } catch (error) {
        return res.status(500).json({ message: error instanceof Error ? error.message : String(error) });
    }
};

export const getMessagesByConversation = async (req: Request, res: Response) => {
    try {
        const { userId, conversationId } = req.params;
        if (!userId || !conversationId) {
            return res.status(400).json({ message: "userId and conversationId are required!" });
        }
        const conversationDoc = await Conversation.findById(conversationId);
        if (!conversationDoc) {
            return res.status(404).json({ message: "Conversation not found!" });
        }
        if (conversationDoc.userId.toString() !== userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const messages = await Message.find({ conversationId: conversationDoc._id }).sort({ createdAt: 1 });
        return res.status(200).json({
            conversationId: conversationDoc._id,
            messages: messages.length ? messages : [],
            message: messages.length ? "Messages fetched" : "No messages yet",
        });
    } catch (error) {
        return res.status(500).json({ message: error instanceof Error ? error.message : String(error) });
    }
};