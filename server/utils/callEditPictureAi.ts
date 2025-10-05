import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
interface GeminiResult {
    text?: string;
    imagePath?: string;
}
export async function callEditPictureAi(imagePath: string, textPrompt: string): Promise<GeminiResult | null> {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY, });
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
    let resultText: string = "";
    let resultImagePath: string | undefined;
    for (const part of candidate.content.parts) {
        if (typeof part.text === "string") {
            resultText += part.text;
        } else if (part.inlineData?.data) {
            const buffer = Buffer.from(part.inlineData.data, "base64");
            const outputPath = "gemini-native-image.png";
            fs.writeFileSync(outputPath, buffer);
            resultImagePath = outputPath;
        }
    }
    return { text: resultText, imagePath: resultImagePath };
}