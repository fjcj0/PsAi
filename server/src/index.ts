import express from "express";
import chalk from "chalk";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "../routes/userRoute";
import mongoose from 'mongoose';

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

mongoose.connect(MongoUrl)
    .then(() => {
        console.log('Database is connected successfully!!');
        app.listen(PORT, () => {
            console.log(chalk.cyanBright(`Server is running on link: http://localhost:${PORT}`));
        });
    })
    .catch((error) => {
        console.error(chalk.red('Database connection error:', error.message));
    });