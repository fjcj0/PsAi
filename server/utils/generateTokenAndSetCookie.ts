import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { Mongoose } from 'mongoose';
export const generateTokenAndSetCookie = (userId: Mongoose, response: Response) => {
    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET NOT INITIALIZED!!');
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    response.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: process.env.NODE_ENV == "development" ? 'strict' : 'none',
        secure: process.env.NODE_ENV !== "development",
    });
    return token;
};