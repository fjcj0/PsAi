import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
export interface JwtRequest extends Request {
    userId?: string;
}
export const verifySession = (req: JwtRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Unauthorized: token not provided" });
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        req.userId = decoded.id;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
