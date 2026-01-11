import { auth } from "@/auth";
import ChatInterface from "@/components/chat-interface";

export default async function Home() {
  const session = await auth();
  return <ChatInterface user={session?.user} />;
}