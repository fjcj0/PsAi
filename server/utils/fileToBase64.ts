import fs from "fs";

// Converts a file to a base64 string
export function fileToBase64(file?: Express.Multer.File): string {
    if (!file) {
        return "";
    }

    // Convert file buffer to base64 if file exists
    if (file.buffer) {
        return file.buffer.toString("base64");
    }

    // If file is saved on disk, read it and convert to base64
    if (file.path) {
        return fs.readFileSync(file.path).toString("base64");
    }

    return "";
}
