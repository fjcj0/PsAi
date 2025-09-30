import { Request, Response, NextFunction } from "express";
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
        response.redirect("http://localhost:3000");
    });
};