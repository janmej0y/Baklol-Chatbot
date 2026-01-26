import { GoogleGenerativeAI } from "@google/generative-ai";

console.log("🔑 GEMINI_API_KEY exists:", !!process.env.GEMINI_API_KEY);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function runGemini(prompt: string) {
  console.log("🧠 Gemini called");

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const result = await model.generateContent(prompt);
  console.log("✅ Gemini responded");

  return result.response.text();
}
