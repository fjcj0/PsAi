"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileToBase64 = fileToBase64;
const fs_1 = __importDefault(require("fs"));
function fileToBase64(file) {
    if (!file) {
        return "";
    }
    if (file.buffer) {
        return file.buffer.toString("base64");
    }
    if (file.path) {
        return fs_1.default.readFileSync(file.path).toString("base64");
    }
    return "";
}
