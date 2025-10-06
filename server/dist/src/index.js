"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ quiet: true });
const express_1 = __importDefault(require("express"));
const chalk_1 = __importDefault(require("chalk"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("../config/passport"));
const authRoute_1 = __importDefault(require("../routes/authRoute"));
const messageRoute_1 = __importDefault(require("../routes/messageRoute"));
const db_1 = require("../lib/db");
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const message_model_1 = require("../models/message.model");
const callAiApi_1 = require("../utils/callAiApi");
const callOrderPictureAiApi_1 = require("../utils/callOrderPictureAiApi");
const callEditPictureAi_1 = require("../utils/callEditPictureAi");
const conversation_model_1 = require("../models/conversation.model");
const fs_1 = __importDefault(require("fs"));
const cleanBase64_1 = require("../utils/cleanBase64");
const PORT = process.env.PORT || 5205;
const MongoUrl = process.env.MONGO_URL;
if (!MongoUrl)
    throw new Error(chalk_1.default.red.bold("MONGO_URL not defined"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV != 'development',
        sameSite: process.env.NODE_ENV != 'development' ? 'none' : 'lax',
    },
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use("/api/auth", authRoute_1.default);
app.use("/api/message", messageRoute_1.default);
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
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
                const newConversation = await conversation_model_1.Conversation.create({
                    userId,
                    conversation: message || "Image conversation",
                });
                conversationId = newConversation._id;
                conversationObj = newConversation;
            }
            const userMessage = await message_model_1.Message.create({
                conversationId,
                userId,
                role: "user",
                content: message || "",
                imageUrl: (0, cleanBase64_1.cleanBase64Image)(imageBase64, "png"),
            });
            socket.emit("receiveMessage", conversationObj
                ? { conversation: conversationObj, message: userMessage }
                : { message: userMessage });
            const msgLower = (message || "").toLowerCase();
            let aiMessage;
            if (imageBase64 && msgLower.includes("edit") && (msgLower.includes("image") || msgLower.includes("picture"))) {
                const tmpImagePath = `tmp-${Date.now()}.png`;
                fs_1.default.writeFileSync(tmpImagePath, Buffer.from(imageBase64, "base64"));
                try {
                    const aiResult = await (0, callEditPictureAi_1.callEditPictureAi)(tmpImagePath, message || "");
                    if (!aiResult || (!aiResult.text && !aiResult.imagePath)) {
                        throw new Error("Can't edit on image free trial end!!");
                    }
                    aiMessage = await message_model_1.Message.create({
                        conversationId,
                        userId,
                        role: "ai",
                        content: aiResult.text || "Edited your image!",
                        imageUrl: aiResult.imagePath
                            ? `data:image/png;base64,${fs_1.default.readFileSync(aiResult.imagePath).toString("base64")}`
                            : null,
                    });
                }
                catch (err) {
                    aiMessage = await message_model_1.Message.create({
                        conversationId,
                        userId,
                        role: "ai",
                        content: "Can't edit on image free trial end!!",
                        imageUrl: null,
                    });
                }
                fs_1.default.unlinkSync(tmpImagePath);
            }
            else if (msgLower.includes("create image") || msgLower.includes("create picture")) {
                try {
                    const aiResult = await (0, callOrderPictureAiApi_1.callOrderPictureAi)(message || "");
                    if (!aiResult || (!aiResult.text && !aiResult.image)) {
                        throw new Error("Can't edit on image free trial end!!");
                    }
                    aiMessage = await message_model_1.Message.create({
                        conversationId,
                        userId,
                        role: "ai",
                        content: aiResult.text || "Here is your image!",
                        imageUrl: aiResult.image
                            ? `data:image/png;base64,${aiResult.image.toString("base64")}`
                            : null,
                    });
                }
                catch (err) {
                    aiMessage = await message_model_1.Message.create({
                        conversationId,
                        userId,
                        role: "ai",
                        content: "Can't edit on image free trial end!!",
                        imageUrl: null,
                    });
                }
            }
            else {
                const aiResponse = await (0, callAiApi_1.callAiApi)({ text: message || "" });
                aiMessage = await message_model_1.Message.create({
                    conversationId,
                    userId,
                    role: "ai",
                    content: aiResponse.text,
                    imageUrl: null,
                });
            }
            socket.emit("receiveMessage", { message: aiMessage });
        }
        catch (error) {
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
        await (0, db_1.connectDB)();
        console.log(chalk_1.default.cyanBright.bold(`Server running at ${process.env.CLIENT_URL}:${PORT}`));
    }
    catch (error) {
        console.log(chalk_1.default.red.bold(error instanceof Error ? error.message : String(error)));
    }
});
