import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";
import cloudinary from "../utils/cloudaniry";
import { getPublicIdFromUrl } from "../utils/getPublicFormUrl";
export const loginSuccess = (request: Request, response: Response) => {
    if (request.user) {
        response.status(200).json({ message: "User logged in", user: request.user });
    } else {
        response.status(401).json({ message: "Not authorized" });
    }
};

export const logoutUser = (request: Request, response: Response, next: NextFunction) => {
    request.logout((err) => {
        if (err) return next(err);
        response.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
        });
        response.redirect("http://localhost:3000");
    });
};

export const editUser = async (req: Request, res: Response) => {
    try {
        const { newDisplayName, userId } = req.body;
        const file = req.file;
        if (!userId) return res.status(400).json({ message: "userId required" });
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
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
        return res.status(200).json({ message: "User updated", user });
    } catch (err) {
        return res.status(400).json({ message: err instanceof Error ? err.message : String(err) });
    }
};