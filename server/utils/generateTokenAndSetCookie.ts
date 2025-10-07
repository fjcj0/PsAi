import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
export const generateTokenAndSetCookie = (userId: string | Types.ObjectId, response: Response) => {
    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET NOT INITIALIZED!!');
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    response.cookie("jwt", token, {
        httpOnly: true,
        secure: false/*process.env.NODE_ENV === "production"*/,
        sameSite: 'strict'/*process.env.NODE_ENV === "production" ? "none" : "lax"*/,
    });
    return token;
};