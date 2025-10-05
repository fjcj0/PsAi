import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
export type AiEditResult = {
    text?: string;
    image?: Buffer;
};
export async function callOrderPictureAi(prompt: string): Promise<AiEditResult> {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    const parts = response.candidates?.[0]?.content?.parts ?? [];
    let textResult = "";
    let imageBuffer: Buffer | undefined;
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