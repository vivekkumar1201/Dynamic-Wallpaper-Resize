import { GoogleGenAI } from "@google/genai";
import { AspectRatio } from "../types";

const API_KEY = process.env.API_KEY || '';

// Initialize the client outside the function to reuse if possible, 
// though we usually just instantiate it per call or in a hook if key changes.
const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Edits or generates an image based on an input image, prompt, and aspect ratio.
 */
export const generateEditedImage = async (
  base64Image: string,
  mimeType: string,
  prompt: string,
  aspectRatio: AspectRatio
): Promise<{ imageUrl: string | null; text: string | null }> => {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please ensure process.env.API_KEY is available.");
  }

  try {
    const model = 'gemini-2.5-flash-image';
    
    // Construct the parts. The model accepts text and inlineData.
    // We combine the prompt with the image.
    const parts = [
      {
        inlineData: {
          data: base64Image,
          mimeType: mimeType,
        },
      },
      {
        text: prompt || "Enhance this image and adjust to the target aspect ratio.",
      },
    ];

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: parts,
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
        },
        // We do not use responseMimeType for this model as per guidelines.
      },
    });

    let generatedImageUrl: string | null = null;
    let generatedText: string | null = null;

    if (response.candidates && response.candidates.length > 0) {
      const content = response.candidates[0].content;
      if (content && content.parts) {
        for (const part of content.parts) {
          if (part.inlineData) {
            const base64String = part.inlineData.data;
            // The API returns raw base64. We assume PNG usually, but let's check or default to png.
            // The response doesn't always explicitly state the return mimeType in the inlineData object in a standard way we can trust blindly, 
            // but standard for generated images is often PNG or JPEG.
            // We will construct a data URL.
            generatedImageUrl = `data:image/png;base64,${base64String}`;
          } else if (part.text) {
            generatedText = part.text;
          }
        }
      }
    }

    return { imageUrl: generatedImageUrl, text: generatedText };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};