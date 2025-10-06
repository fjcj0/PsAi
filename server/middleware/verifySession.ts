import { Request, Response, NextFunction } from "express";
export const verifySession = (request: Request, response: Response, next: NextFunction) => {
    if (request.user) {
        const userId = (request.user as any)._id || (request.user as any).id;
        return next();
    }
    return response.status(401).json({
        success: false,
        message: "Unauthorized - session not found or expired",
    });
};