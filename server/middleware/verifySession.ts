import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Request } from "express";
export interface JwtRequest extends Request {
    userId?: string;
}
export const verifySession = (req: JwtRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized - no token provided!' });
    }
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not defined");
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };
        req.userId = decoded.userId;
        next();
    } catch (error: unknown) {
        return res.status(401).json({ success: false, message: error instanceof Error ? error.message : String(error) });
    }
};