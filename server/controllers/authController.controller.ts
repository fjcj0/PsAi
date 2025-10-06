import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";
import cloudinary from "../utils/cloudaniry";
import { getPublicIdFromUrl } from "../utils/getPublicFormUrl";
export const loginSuccess = async (request: Request, response: Response) => {
    try {
        const user = await User.findById((request as any).userId).select('-password');
        if (!user) {
            return response.status(404).json({ success: false, message: 'No user is authenticated!' });
        }
        return response.status(200).json({ success: true, user });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        return response.status(400).json({ success: false, message });
    }
};
export const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await new Promise<void>((resolve, reject) => {
            req.logout((err) => {
                if (err) return reject(err);
                resolve();
            });
        });
        await new Promise<void>((resolve, reject) => {
            req.session.destroy((err) => {
                if (err) return reject(err);
                resolve();
            });
        });
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: (process.env.NODE_ENV === "development" ? "strict" : "none") as "strict" | "none",
            path: "/",
        };
        res.clearCookie("connect.sid", cookieOptions);
        res.clearCookie("jwt", cookieOptions);
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Logout failed" });
    }
};
export const editUser = async (request: Request, response: Response) => {
    try {
        const { newDisplayName, userId } = request.body;
        const file = request.file;
        if (!userId) return response.status(400).json({ message: "userId required" });
        const user = await User.findById(userId);
        if (!user) return response.status(404).json({ message: "User not found" });
        if (newDisplayName) user.displayName = newDisplayName;
        if (file) {
            if (user.image) {
                const publicId = getPublicIdFromUrl(user.image, "users");
                await cloudinary.uploader.destroy(publicId);
            }
            const uploadResult = await new Promise<any>((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "users" },
                    (error, result) => (error ? reject(error) : resolve(result))
                );
                stream.end(file.buffer);
            });
            user.image = uploadResult.secure_url;
        }
        await user.save();
        return response.status(200).json({ message: "User updated", user });
    } catch (error) {
        return response.status(400).json({ message: error instanceof Error ? error.message : String(error) });
    }
};