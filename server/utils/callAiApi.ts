import { GoogleGenAI } from "@google/genai";
import { GeminiResponse } from "../types";
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});
export async function callAiApi(requestData: { text: string }): Promise<GeminiResponse> {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: requestData.text,
        });
        if (!response.text) {
            throw new Error("Gemini API returned empty text");
        }
        return { text: response.text };
    } catch (error: any) {
        console.error("Gemini API error:", error);
        const errorData = error.response?.data || error.message || JSON.stringify(error);
        throw new Error(errorData);
    }
}