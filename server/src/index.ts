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
import { callOrderPictureAi } from "../utils/callOrderPictureAiApi";
import { callEditPictureAi } from "../utils/callEditPictureAi";
import { Conversation } from "../models/conversation.model";
import fs from 'fs';
import { cleanBase64Image } from "../utils/cleanBase64";

const PORT = process.env.PORT || 5205;

const MongoUrl = process.env.MONGO_URL;

if (!MongoUrl) throw new Error(chalk.red.bold("MONGO_URL not defined"));

const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_URL,
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
            secure: process.env.NODE_ENV != 'development',
            sameSite: process.env.NODE_ENV == "development" ? 'strict' : 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000,
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
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST", "DELETE", "PUT"],
        credentials: true,
    },
});

io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);
    socket.on("sendMessageToAi", async (data) => {
        try {
            const { userId, conversation, message, imageBase64 } = data;
            if (!userId || (!message && !imageBase64)) {
                return socket.emit("errorMessage", "userId and message or image are required");
            }
            let conversationId = conversation;
            let conversationObj = null;
            if (!conversationId) {
                const newConversation = await Conversation.create({
                    userId,
                    conversation: message || "Image conversation",
                });
                conversationId = newConversation._id;
                conversationObj = newConversation;
            }
            const userMessage = await Message.create({
                conversationId,
                userId,
                role: "user",
                content: message || "",
                imageUrl: cleanBase64Image(imageBase64, "png"),
            });
            socket.emit("receiveMessage", conversationObj
                ? { conversation: conversationObj, message: userMessage }
                : { message: userMessage }
            );
            const msgLower = (message || "").toLowerCase();
            let aiMessage;
            if (imageBase64 && msgLower.includes("edit") && (msgLower.includes("image") || msgLower.includes("picture"))) {
                const tmpImagePath = `tmp-${Date.now()}.png`;
                fs.writeFileSync(tmpImagePath, Buffer.from(imageBase64, "base64"));
                try {
                    const aiResult = await callEditPictureAi(tmpImagePath, message || "");
                    if (!aiResult || (!aiResult.text && !aiResult.imagePath)) {
                        throw new Error("Can't edit on image free trial end!!");
                    }
                    aiMessage = await Message.create({
                        conversationId,
                        userId,
                        role: "ai",
                        content: aiResult.text || "Edited your image!",
                        imageUrl: aiResult.imagePath
                            ? `data:image/png;base64,${fs.readFileSync(aiResult.imagePath).toString("base64")}`
                            : null,
                    });
                } catch (err) {
                    aiMessage = await Message.create({
                        conversationId,
                        userId,
                        role: "ai",
                        content: "Can't edit on image free trial end!!",
                        imageUrl: null,
                    });
                }
                fs.unlinkSync(tmpImagePath);
            } else if (msgLower.includes("create image") || msgLower.includes("create picture")) {
                try {
                    const aiResult = await callOrderPictureAi(message || "");
                    if (!aiResult || (!aiResult.text && !aiResult.image)) {
                        throw new Error("Can't edit on image free trial end!!");
                    }
                    aiMessage = await Message.create({
                        conversationId,
                        userId,
                        role: "ai",
                        content: aiResult.text || "Here is your image!",
                        imageUrl: aiResult.image
                            ? `data:image/png;base64,${aiResult.image.toString("base64")}`
                            : null,
                    });
                } catch (err) {
                    aiMessage = await Message.create({
                        conversationId,
                        userId,
                        role: "ai",
                        content: "Can't edit on image free trial end!!",
                        imageUrl: null,
                    });
                }
            } else {
                const aiResponse = await callAiApi({ text: message || "" });
                aiMessage = await Message.create({
                    conversationId,
                    userId,
                    role: "ai",
                    content: aiResponse.text,
                    imageUrl: null,
                });
            }
            socket.emit("receiveMessage", { message: aiMessage });
        } catch (error: any) {
            console.log("sendMessageToAi error:", error);
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