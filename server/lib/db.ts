import chalk from "chalk";
import mongoose from "mongoose";
export const connectDB = async () => {
    if (!process.env.MONGO_URL) throw new Error('MONGO_URL IS NOT DEFINED!!');
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(chalk.green.bold(`MongoDB Connected successfully!!`));
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : String(error));
    }
};