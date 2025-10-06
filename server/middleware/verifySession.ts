import { Request, Response, NextFunction } from "express";

export const verifySession = (req: Request, res: Response, next: NextFunction) => {
    if (req.user) return next();
    return res.status(401).json({
        success: false,
        message: "Unauthorized - session expired, please login again",
    });
};
