"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanBase64Image = cleanBase64Image;
function cleanBase64Image(base64String, type = "png") {
    if (!base64String)
        return null;
    const regex = /^data:(image\/[a-zA-Z]+);base64,/;
    const cleaned = base64String.replace(regex, "");
    return `data:image/${type};base64,${cleaned}`;
}
