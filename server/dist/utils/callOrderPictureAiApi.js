"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.callOrderPictureAi = callOrderPictureAi;
const genai_1 = require("@google/genai");
const fs = __importStar(require("node:fs"));
async function callOrderPictureAi(prompt) {
    const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    const parts = response.candidates?.[0]?.content?.parts ?? [];
    let textResult = "";
    let imageBuffer;
    for (const part of parts) {
        if ("text" in part && typeof part.text === "string") {
            textResult += part.text + "\n";
        }
        if ("inlineData" in part && part.inlineData && typeof part.inlineData.data === "string") {
            const imageData = part.inlineData.data;
            imageBuffer = Buffer.from(imageData, "base64");
            fs.writeFileSync("gemini-native-image.png", imageBuffer);
        }
    }
    return {
        text: textResult.trim() || undefined,
        image: imageBuffer,
    };
}
