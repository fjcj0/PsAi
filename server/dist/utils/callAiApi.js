"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callAiApi = callAiApi;
const genai_1 = require("@google/genai");
const ai = new genai_1.GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});
async function callAiApi(requestData) {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: requestData.text,
        });
        if (!response.text) {
            throw new Error("Gemini API returned empty text");
        }
        return { text: response.text };
    }
    catch (error) {
        console.error("Gemini API error:", error);
        const errorData = error.response?.data || error.message || JSON.stringify(error);
        throw new Error(errorData);
    }
}
