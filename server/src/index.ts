import express from "express";
import chalk from "chalk";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "../routes/userRoute";
import { connectDB } from "../lib/db";

dotenv.config();

const MongoUrl = process.env.MONGO_URL;

const PORT = process.env.PORT || 5205;

if (!MongoUrl) {
    throw new Error(chalk.red.bold('MONGO_URL is not defined in your .env file!!'));
}

const app = express();

app.use(cookieParser());
app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);

app.listen(PORT, () => {
    try {
        connectDB();
        console.log(chalk.cyanBright.bold(`App is running on localhost: http://localhost:${PORT}`));
    } catch (error) {
        console.log(chalk.red.bold(error instanceof Error ? error.message : String(error)));
    }
});