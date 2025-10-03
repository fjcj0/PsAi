import fs from "fs";
export function fileToBase64(file?: Express.Multer.File): string {
    if (!file) {
        return "";
    }
    if (file.buffer) {
        return file.buffer.toString("base64");
    }
    if (file.path) {
        return fs.readFileSync(file.path).toString("base64");
    }
    return "";
}