import { Router } from "express";
import passport from "../config/passport";
import { loginSuccess, logoutUser } from "../controllers/authController.controller";
import { verifySession } from "../middleware/verifySession";

const router = Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", (req, res, next) => {
    passport.authenticate("google", (err: any, user: any) => {
        if (err || !user) {
            return res.redirect(`${process.env.CLIENT_URL}/?error=failed_login`);
        }
        req.logIn(user, (err) => {
            if (err) return next(err);
            return res.redirect(`${process.env.CLIENT_URL}/chat`);
        });
    })(req, res, next);
});

router.get("/success", verifySession, loginSuccess);
router.get("/logout", verifySession, logoutUser);

export default router;
