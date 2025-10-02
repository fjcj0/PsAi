import dotenv from "dotenv";
dotenv.config({ quiet: true });
import express from "express";
import chalk from "chalk";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import passport from "../config/passport";
import authRoutes from "../routes/authRoute";
import { connectDB } from "../lib/db";

const PORT = process.env.PORT || 5205;

const MongoUrl = process.env.MONGO_URL;

if (!MongoUrl) throw new Error(chalk.red.bold("MONGO_URL not defined"));

const app = express();

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

app.use(express.json());

app.use(cookieParser());

app.use(
    session({
        secret: process.env.SESSION_SECRET || "secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        },
    })
);

app.use(passport.initialize());

app.use(passport.session());

app.use("/api/auth", authRoutes);

app.listen(PORT, async () => {
    try {
        await connectDB();
        console.log(chalk.cyanBright.bold(`Server running at http://localhost:${PORT}`));
    } catch (error) {
        console.log(chalk.red.bold(error instanceof Error ? error.message : String(error)));
    }
});