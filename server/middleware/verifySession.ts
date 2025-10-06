import { Request, Response, NextFunction } from "express";
export const verifySession = (req: Request, res: Response, next: NextFunction) => {
    if (req.user) return next();
    console.log("Session expired or user not logged in");
    return res.status(401).json({
        success: false,
        message: "Unauthorized - your session has expired. Please log in again.",
    });
};