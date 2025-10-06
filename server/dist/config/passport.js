"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth2_1 = require("passport-google-oauth2");
const user_model_1 = require("../models/user.model");
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET not set in .env");
}
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await user_model_1.User.findById(id);
        done(null, user);
    }
    catch (error) {
        done(error, null);
    }
});
passport_1.default.use(new passport_google_oauth2_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback",
    scope: ["profile", "email"]
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await user_model_1.User.findOne({ googleId: profile.id });
        if (!user) {
            user = await user_model_1.User.create({
                googleId: profile.id,
                displayName: profile.displayName,
                email: profile.emails?.[0].value || "",
                image: profile.photos?.[0].value || ""
            });
        }
        done(null, user);
    }
    catch (err) {
        done(err, null);
    }
}));
exports.default = passport_1.default;
