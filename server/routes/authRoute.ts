import { Router } from "express";
import passport from "../config/passport";
import { loginSuccess, logoutUser } from "../controllers/authController.controller";

const router = Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
    "/google/callback",
    (req, res, next) => {
        passport.authenticate("google", async (err: any, user: any) => {
            if (err || !user) {
                const errorRedirect =
                    process.env.NODE_ENV !== "development"
                        ? `${process.env.CLIENT_URL}/?error=${encodeURIComponent("failed login")}`
                        : `http://localhost:3000/?error=${encodeURIComponent("failed login")}`;
                return res.redirect(errorRedirect);
            }
            req.logIn(user, async (err) => {
                if (err) return next(err);
                const { generateTokenAndSetCookie } = await import("../utils/generateTokenAndSetCookie");
                generateTokenAndSetCookie(user.id, res);
                return res.redirect(
                    process.env.NODE_ENV !== "development"
                        ? `${process.env.CLIENT_URL}/chat`
                        : "http://localhost:3000/chat"
                );
            });
        })(req, res, next);
    }
);

router.get("/success", loginSuccess);

router.get("/logout", logoutUser);

export default router;