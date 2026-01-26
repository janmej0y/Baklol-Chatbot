import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Chat from "@/models/Chat";
import { auth } from "@/auth";
import { runGemini } from "@/lib/gemini";

const MAX_MESSAGES = 10;
const CYCLE_DAYS = 28;

export async function POST(req: Request) {
  try {
    // 1️⃣ AUTH CHECK
    const session = await auth();
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return NextResponse.json(
        { content: "You must be logged in to chat." },
        { status: 401 }
      );
    }

    // 2️⃣ DB INIT
    await connectToDatabase();
    let userChat = await Chat.findOne({ userEmail });

    if (!userChat) {
      userChat = new Chat({
        userEmail,
        usageCount: 0,
        cycleStartDate: new Date(),
        messages: [],
      });
    }

    // 3️⃣ RESET CYCLE (28 DAYS)
    const now = new Date();
    const startDate = new Date(userChat.cycleStartDate);
    const expiryDate = new Date(startDate);
    expiryDate.setDate(expiryDate.getDate() + CYCLE_DAYS);

    if (now > expiryDate) {
      userChat.usageCount = 0;
      userChat.cycleStartDate = now;
      userChat.messages = [];
    }

    // 4️⃣ BLOCK IF LIMIT REACHED
    if (userChat.usageCount >= MAX_MESSAGES) {
      const diffTime = expiryDate.getTime() - now.getTime();
      const diffDays = Math.max(
        1,
        Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      );

      return NextResponse.json({
        content: `You are exceeding the chat limit. You can chat with Baklol after ${diffDays} days.`,
        limitReached: true,
      });
    }

    // 5️⃣ READ USER MESSAGE
    const { messages } = await req.json();
    const latestMessage: string | undefined =
      messages?.[messages.length - 1]?.content;

    if (!latestMessage) {
      return NextResponse.json(
        { error: "No message provided" },
        { status: 400 }
      );
    }

    // 6️⃣ GEMINI CALL (CLEAN & SAFE)
    let aiContent: string;

    try {
      aiContent = await runGemini(latestMessage);
    } catch (err) {
      console.error("Gemini Error:", err);
      return NextResponse.json(
        { error: "AI service unavailable" },
        { status: 503 }
      );
    }

    // 7️⃣ SAVE MESSAGE + INCREMENT
    userChat.usageCount += 1;
    userChat.messages.push({ role: "user", content: latestMessage });
    userChat.messages.push({ role: "assistant", content: aiContent });

    await userChat.save();

    // 8️⃣ SIGNAL LIMIT IF JUST REACHED
    const limitReachedNow = userChat.usageCount >= MAX_MESSAGES;

    return NextResponse.json({
      content: aiContent,
      limitReached: limitReachedNow,
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
