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
exports.callEditPictureAi = callEditPictureAi;
const genai_1 = require("@google/genai");
const fs = __importStar(require("node:fs"));
async function callEditPictureAi(imagePath, textPrompt) {
    const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY, });
    const imageData = fs.readFileSync(imagePath);
    const base64Image = imageData.toString("base64");
    const contents = [
        { text: textPrompt },
        {
            inlineData: {
                mimeType: "image/png",
                data: base64Image,
            },
        },
    ];
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents,
    });
    if (!response?.candidates?.length) {
        console.error("No candidates found in response!!");
        return null;
    }
    const candidate = response.candidates[0];
    if (!candidate?.content?.parts?.length) {
        console.error("No content parts found in candidate!!");
        return null;
    }
    let resultText = "";
    let resultImagePath;
    for (const part of candidate.content.parts) {
        if (typeof part.text === "string") {
            resultText += part.text;
        }
        else if (part.inlineData?.data) {
            const buffer = Buffer.from(part.inlineData.data, "base64");
            const outputPath = "gemini-native-image.png";
            fs.writeFileSync(outputPath, buffer);
            resultImagePath = outputPath;
        }
    }
    return { text: resultText, imagePath: resultImagePath };
}
