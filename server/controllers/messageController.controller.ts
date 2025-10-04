import { Request, Response } from "express";
import { Conversation } from "../models/conversation.model";
import { Message } from "../models/message.model";
import { callAiApi } from "../utils/callAiApi";
import mongoose from "mongoose";
export const sendMessageToAi = async (req: Request, res: Response) => {
    try {
        const { userId, conversation, message } = req.body;
        if (!userId || !message) {
            return res.status(400).json({ message: "userId and message are required" });
        }
        let conversationId = conversation;
        if (!conversationId) {
            const newConversation = await Conversation.create({
                userId,
                conversation: message,
            });
            conversationId = newConversation._id;
        }
        await Message.create({
            conversationId,
            userId,
            role: "user",
            content: message,
        });
        const aiResponse = await callAiApi({ text: message });
        const aiMessage = await Message.create({
            conversationId,
            role: "ai",
            content: aiResponse.text,
            userId,
        });
        res.status(200).json({ aiMessage });
    } catch (error: any) {
        console.error("sendMessageToAi error full:", error);
        res.status(500).json({
            message: "Failed to send message to AI",
            error: error.message || JSON.stringify(error),
        });
    }
};

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
        if (deletedConversation.deletedCount > 0) {
            return res.status(200).json({ message: "Conversation deleted successfully!" });
        } else {
            return res.status(404).json({ message: "Conversation not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: error instanceof Error ? error.message : String(error) });
    }
};

export const getMessagesByConversation = async (req: Request, res: Response) => {
    try {
        const { userId, conversation } = req.body;
        if (!userId || !conversation) {
            return res.status(400).json({ message: "userId and conversation are required!" });
        }
        const conversationDoc = await Conversation.findOne({ userId, conversation });
        if (!conversationDoc) {
            return res.status(404).json({ message: "Conversation not found!" });
        }
        const messages = await Message.find({ conversationId: conversationDoc._id }).sort({ createdAt: 1 });
        return res.status(200).json({ conversationId: conversationDoc._id, messages });
    } catch (error) {
        return res.status(500).json({ message: error instanceof Error ? error.message : String(error) });
    }
};