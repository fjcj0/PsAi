import { Router } from "express";
import passport from "../config/passport";
import { editUser, loginSuccess, logoutUser } from "../controllers/authController.controller";
import { upload } from "../utils/multer";
import { verifySession } from "../middleware/verifySession";

const router = Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
    "/google/callback",
    (req, res, next) => {
        passport.authenticate("google", async (err: any, user: any) => {
            if (err || !user) {
                const errorRedirect = `${process.env.CLIENT_URL}/?error=${encodeURIComponent("failed login")}`
                return res.redirect(errorRedirect);
            }
            req.logIn(user, async (err) => {
                if (err) return next(err);
                const { generateTokenAndSetCookie } = await import("../utils/generateTokenAndSetCookie");
                generateTokenAndSetCookie(user.id, res);
                return res.status(200).json({ success: true });
            });
        })(req, res, next);
    }
);

router.get("/success", verifySession, loginSuccess);

router.get("/logout", verifySession, logoutUser);

router.post('/edit-user', verifySession, upload.single('newProfilePicture'), editUser);

export default router;