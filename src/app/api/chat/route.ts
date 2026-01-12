import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Chat from "@/models/Chat";
import { auth } from "@/auth";

const MAX_MESSAGES = 10;
const CYCLE_DAYS = 28;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return NextResponse.json({ content: "You must be logged in to chat." });
    }

    await connectToDatabase();
    let userChat = await Chat.findOne({ userEmail });

    // Initialize new user
    if (!userChat) {
      userChat = new Chat({ 
        userEmail, 
        usageCount: 0, 
        cycleStartDate: new Date(),
        messages: [] 
      });
    }

    // 1. CHECK RESET CYCLE (28 Days)
    const now = new Date();
    const startDate = new Date(userChat.cycleStartDate);
    const expiryDate = new Date(startDate);
    expiryDate.setDate(expiryDate.getDate() + CYCLE_DAYS);

    if (now > expiryDate) {
      userChat.usageCount = 0;
      userChat.cycleStartDate = now;
    }

    // 2. CHECK BLOCKING (Before processing)
    if (userChat.usageCount >= MAX_MESSAGES) {
      const diffTime = Math.abs(expiryDate.getTime() - now.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      return NextResponse.json({ 
        content: `You are exceeding the chat limit. You can chat with Baklol after ${diffDays} days.`,
        limitReached: true // Signal to lock UI
      });
    }

    // 3. PROCESS MESSAGE (If count is 0-9)
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "Missing API Key" }, { status: 500 });

    const { messages } = await req.json();
    const latestMessage = messages[messages.length - 1]?.content;

    // Retry Logic for Gemini
    let aiContent = "";
    let attempts = 0;
    let success = false;

    while (attempts < 3 && !success) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ role: "user", parts: [{ text: latestMessage }] }]
            }),
          }
        );

        if (response.status === 429) {
          await delay(4000);
          attempts++;
          continue;
        }

        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || "API Error");

        aiContent = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
        success = true;

      } catch (error) {
        attempts++;
        if (attempts >= 3) throw error;
      }
    }

    // 4. INCREMENT & SAVE
    userChat.usageCount += 1;
    userChat.messages.push({ role: "user", content: latestMessage });
    userChat.messages.push({ role: "assistant", content: aiContent });
    
    await userChat.save();

    // 5. CHECK IF LIMIT REACHED (AFTER incrementing)
    // If usageCount became 10 just now, we tell frontend to lock immediately
    const limitReachedNow = userChat.usageCount >= MAX_MESSAGES;

    return NextResponse.json({ 
        content: aiContent,
        limitReached: limitReachedNow // <--- CRITICAL UPDATE
    });

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}