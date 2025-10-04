import dotenv from "dotenv";
dotenv.config({ quiet: true });
import express from "express";
import chalk from "chalk";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import passport from "../config/passport";
import authRoutes from "../routes/authRoute";
import messageRoutes from "../routes/messageRoute";
import { connectDB } from "../lib/db";
import { Server } from "socket.io";
import { createServer } from "http";
import { Message } from "../models/message.model";
import { callAiApi } from "../utils/callAiApi";
import { Conversation } from "../models/conversation.model";

const PORT = process.env.PORT || 5205;

const MongoUrl = process.env.MONGO_URL;

if (!MongoUrl) throw new Error(chalk.red.bold("MONGO_URL not defined"));

const app = express();

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(cookieParser());

app.use(
    session({
        secret: process.env.SESSION_SECRET || "secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        },
    })
);

app.use(passport.initialize());

app.use(passport.session());

app.use("/api/auth", authRoutes);

app.use("/api/message", messageRoutes);

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "DELETE", "PUT"],
        credentials: true,
    },
});

io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);
    socket.on("sendMessageToAi", async (data) => {
        try {
            const { userId, conversation, message } = data;
            if (!userId || !message) {
                return socket.emit("errorMessage", "userId and Message are required");
            }
            let conversationId = conversation;
            let conversationObj = null;
            if (!conversationId) {
                const newConversation = await Conversation.create({
                    userId,
                    conversation: message,
                });
                conversationId = newConversation._id;
                conversationObj = newConversation;
            }
            const userMessage = await Message.create({
                conversationId,
                userId,
                role: "user",
                content: message,
            });
            socket.emit("receiveMessage", conversationObj ? { conversation: conversationObj, message: userMessage } : { message: userMessage });
            const aiResponse = await callAiApi({ text: message });
            const aiMessage = await Message.create({
                conversationId,
                userId,
                role: "ai",
                content: aiResponse.text,
            });
            socket.emit("receiveMessage", { message: aiMessage });
        } catch (error: any) {
            console.error("sendMessageToAi error:", error);
            socket.emit("errorMessage", error.message || "Failed to send message to AI");
        }
    });
    socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

httpServer.listen(PORT, async () => {
    try {
        await connectDB();
        console.log(chalk.cyanBright.bold(`Server running at http://localhost:${PORT}`));
    } catch (error) {
        console.log(
            chalk.red.bold(error instanceof Error ? error.message : String(error))
        );
    }
});