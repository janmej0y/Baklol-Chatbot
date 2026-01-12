import { auth } from "@/auth";
import ChatInterface from "@/components/chat-interface";
import connectToDatabase from "@/lib/db";
import Chat from "@/models/Chat";

export default async function Home() {
  const session = await auth();
  let history = [];
  let isLimitReached = false;

  if (session?.user?.email) {
    try {
      await connectToDatabase();
      const userChat = await Chat.findOne({ userEmail: session.user.email });
      
      if (userChat) {
        // If they have 10 or more messages, they are blocked on load
        if (userChat.usageCount >= 10) {
            isLimitReached = true;
        }

        if (userChat.messages) {
          history = userChat.messages.map((msg: any) => ({
            role: msg.role,
            content: msg.content,
          }));
        }
      }
    } catch (error) {
      console.error("Failed to load chat history:", error);
    }
  }

  return <ChatInterface user={session?.user} initialMessages={history} initialLimitReached={isLimitReached} />;
}