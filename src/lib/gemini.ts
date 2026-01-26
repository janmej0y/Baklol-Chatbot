export async function runGemini(prompt: string): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
  
    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY");
    }
  
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
      }
    );
  
    if (!response.ok) {
      const error = await response.text();
      console.error("❌ Gemini 2.5 Flash API error:", error);
      throw new Error("Gemini request failed");
    }
  
    const data = await response.json();
  
    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from Gemini"
    );
  }
  