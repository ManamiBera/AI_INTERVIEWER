import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Server-side Gemini client. The API key lives ONLY in the server environment
 * (GEMINI_API_KEY in .env.local) and is never shipped to the browser.
 *
 * Get a free key at https://aistudio.google.com/app/apikey
 */

export const GEMINI_MODEL = "gemini-2.0-flash";

export function hasGeminiKey(): boolean {
  return !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 10;
}

export function getGemini() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not set");
  return new GoogleGenerativeAI(key);
}

/** Extract the first valid JSON object from a model response (handles ```json fences). */
export function extractJson<T>(text: string): T {
  let cleaned = text.trim();
  // Strip code fences
  const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) cleaned = fenceMatch[1].trim();
  // Fall back to the outermost braces
  if (!cleaned.startsWith("{")) {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start !== -1 && end !== -1) cleaned = cleaned.slice(start, end + 1);
  }
  return JSON.parse(cleaned) as T;
}

/** Call Gemini with a text prompt (optionally including an inline document) and get JSON back. */
export async function generateJson<T>(opts: {
  prompt: string;
  inlineData?: { mimeType: string; data: string }; // base64 (no data: prefix)
  temperature?: number;
}): Promise<T> {
  const genAI = getGemini();
  const model = genAI.getGenerativeModel({
    model: GEMINI_MODEL,
    generationConfig: {
      temperature: opts.temperature ?? 0.4,
      responseMimeType: "application/json",
    },
  });

  const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [
    { text: opts.prompt },
  ];
  if (opts.inlineData) {
    parts.push({ inlineData: { mimeType: opts.inlineData.mimeType, data: opts.inlineData.data } });
  }

  const result = await model.generateContent(parts);
  const text = result.response.text();
  return extractJson<T>(text);
}
