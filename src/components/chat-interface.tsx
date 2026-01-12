"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/components/ui/chat-message";
import { ChatInput } from "@/components/ui/chat-input";
import { Sparkles, Terminal, Moon, Sun, Trash2 } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { LoginButton, LogoutButton } from "@/components/ui/auth-buttons";
import Image from "next/image";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Updated props to include initialLimitReached
export default function ChatInterface({ 
  user, 
  initialMessages = [], 
  initialLimitReached = false 
}: { 
  user: any, 
  initialMessages?: Message[], 
  initialLimitReached?: boolean 
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLimitReached, setIsLimitReached] = useState(initialLimitReached); // State for blocking
  const [isLoading, setIsLoading] = useState(false);
  
  // Theme hydration fix
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fix hydration mismatch for theme
  useEffect(() => {
    setMounted(true);
  }, []);

  const suggestions = [
    { icon: <Terminal size={18} />, text: "Write a React component" },
    { icon: <Sparkles size={18} />, text: "Explain Quantum Physics" },
    { icon: <Terminal size={18} />, text: "Debug this Python script" },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (content: string) => {
    const newMessages: Message[] = [...messages, { role: "user", content }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json(); // Read JSON first to check for flags

      if (!response.ok) throw new Error("Failed to fetch");

      // 🔴 CHECK IF BACKEND SAYS LIMIT REACHED
      if (data.limitReached) {
        setIsLimitReached(true);
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.content },
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => setMessages([]);

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800/50 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">B</span>
          </div>
          <h1 className="font-semibold text-lg tracking-tight">Baklol</h1>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {user.image && (
                  <Image
                    src={user.image}
                    alt="User"
                    width={28}
                    height={28}
                    className="rounded-full border border-zinc-200 dark:border-zinc-700"
                  />
                )}
                <span className="text-sm font-medium hidden sm:block">
                  {user.name?.split(" ")[0]}
                </span>
              </div>
              <LogoutButton />
            </div>
          ) : (
            <LoginButton />
          )}

          <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-1"></div>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-zinc-500"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-zinc-500"
          >
            {/* Safe theme rendering */}
            {mounted ? (
              theme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />
            ) : (
               <div className="w-5 h-5" />
            )}
          </button>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar relative">
        <div className="max-w-3xl mx-auto w-full pb-32 pt-6">
          <AnimatePresence mode="wait">
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center space-y-8"
              >
                <div className="space-y-2">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    {user ? `Hello, ${user.name?.split(" ")[0]}.` : "Hello, Human."}
                  </h2>
                  <p className="text-zinc-500 dark:text-zinc-400 text-lg">
                    I'm Baklol. How can I help you today?
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-2xl">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(s.text)}
                      className="flex flex-col items-start p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-all text-left group"
                    >
                      <span className="p-2 bg-white dark:bg-zinc-800 rounded-lg mb-3 shadow-sm group-hover:scale-110 transition-transform">
                        {s.icon}
                      </span>
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        {s.text}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {messages.map((msg, idx) => (
                  <ChatMessage key={idx} role={msg.role} content={msg.content} />
                ))}
                {isLoading && (
                  <div className="flex items-center justify-center p-4">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent dark:from-zinc-950 dark:via-zinc-950 pb-6 z-20">
        {/* Pass the disabled prop here */}
        <ChatInput 
          onSend={handleSend} 
          isLoading={isLoading} 
          disabled={isLimitReached} 
        />
      </footer>
    </div>
  );
}