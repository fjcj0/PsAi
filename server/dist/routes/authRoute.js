"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("../config/passport"));
const authController_controller_1 = require("../controllers/authController.controller");
const multer_1 = require("../utils/multer");
const verifySession_1 = require("../middleware/verifySession");
const router = (0, express_1.Router)();
router.get("/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", (req, res, next) => {
    passport_1.default.authenticate("google", async (err, user) => {
        if (err || !user) {
            const errorRedirect = process.env.NODE_ENV !== "development"
                ? `${process.env.CLIENT_URL}/?error=${encodeURIComponent("failed login")}`
                : `http://localhost:3000/?error=${encodeURIComponent("failed login")}`;
            return res.redirect(errorRedirect);
        }
        req.logIn(user, async (err) => {
            if (err)
                return next(err);
            const { generateTokenAndSetCookie } = await Promise.resolve().then(() => __importStar(require("../utils/generateTokenAndSetCookie")));
            generateTokenAndSetCookie(user.id, res);
            return res.redirect(process.env.NODE_ENV !== "development"
                ? `${process.env.CLIENT_URL}/chat`
                : "http://localhost:3000/chat");
        });
    })(req, res, next);
});
router.get("/success", verifySession_1.verifySession, authController_controller_1.loginSuccess);
router.get("/logout", verifySession_1.verifySession, authController_controller_1.logoutUser);
router.post('/edit-user', verifySession_1.verifySession, multer_1.upload.single('newProfilePicture'), authController_controller_1.editUser);
exports.default = router;
