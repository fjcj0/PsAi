import { Router } from "express";
import passport from "../config/passport";
import { loginSuccess, logoutUser } from "../controllers/authController.controller";

const router = Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
    "/google/callback",
    passport.authenticate("google", {
        successRedirect: "http://localhost:3000/chat",
        failureRedirect: `http://localhost:3000/home?error=${encodeURIComponent("failed login")}`
    })
);

router.get("/success", loginSuccess);

router.get("/logout", logoutUser);

export default router;