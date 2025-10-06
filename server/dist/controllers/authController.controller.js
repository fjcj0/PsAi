"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editUser = exports.logoutUser = exports.loginSuccess = void 0;
const user_model_1 = require("../models/user.model");
const cloudaniry_1 = __importDefault(require("../utils/cloudaniry"));
const getPublicFormUrl_1 = require("../utils/getPublicFormUrl");
const loginSuccess = (request, response) => {
    if (request.user) {
        response.status(200).json({ message: "User logged in", user: request.user });
    }
    else {
        response.status(401).json({ message: "Not authorized" });
    }
};
exports.loginSuccess = loginSuccess;
const logoutUser = (request, response, next) => {
    request.logout((err) => {
        if (err)
            return next(err);
        response.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
        });
        response.redirect("http://localhost:3000");
    });
};
exports.logoutUser = logoutUser;
const editUser = async (request, response) => {
    try {
        const { newDisplayName, userId } = request.body;
        const file = request.file;
        if (!userId)
            return response.status(400).json({ message: "userId required" });
        const user = await user_model_1.User.findById(userId);
        if (!user)
            return response.status(404).json({ message: "User not found" });
        if (newDisplayName)
            user.displayName = newDisplayName;
        if (file) {
            if (user.image) {
                const publicId = (0, getPublicFormUrl_1.getPublicIdFromUrl)(user.image, "users");
                await cloudaniry_1.default.uploader.destroy(publicId);
            }
            const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudaniry_1.default.uploader.upload_stream({ folder: "users" }, (error, result) => (error ? reject(error) : resolve(result)));
                stream.end(file.buffer);
            });
            user.image = uploadResult.secure_url;
        }
        await user.save();
        return response.status(200).json({ message: "User updated", user });
    }
    catch (error) {
        return response.status(400).json({ message: error instanceof Error ? error.message : String(error) });
    }
};
exports.editUser = editUser;
