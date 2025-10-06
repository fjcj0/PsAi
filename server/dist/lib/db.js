"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const chalk_1 = __importDefault(require("chalk"));
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    if (!process.env.MONGO_URL)
        throw new Error('MONGO_URL IS NOT DEFINED!!');
    try {
        const conn = await mongoose_1.default.connect(process.env.MONGO_URL);
        console.log(chalk_1.default.green.bold(`MongoDB Connected successfully!!`));
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : String(error));
    }
};
exports.connectDB = connectDB;
