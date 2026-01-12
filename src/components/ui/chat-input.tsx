"use client";

import { SendHorizontal } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import { useState, KeyboardEvent } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean; // Add this property
}

export function ChatInput({ onSend, isLoading, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="w-full max-w-3xl mx-auto relative">
      <div className="relative flex items-end gap-2 bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-3xl p-2 pl-4 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
        <TextareaAutosize
          minRows={1}
          maxRows={6}
          placeholder="Ask Baklol anything..."
          className="flex-1 bg-transparent border-none resize-none focus:outline-none py-3 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled} // Pass the disabled prop to the input element
        />
        <button
          onClick={handleSubmit}
          disabled={!input.trim() || isLoading}
          className="p-3 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all mb-0.5"
        >
          <SendHorizontal className="w-5 h-5" />
        </button>
      </div>
      <p className="text-center text-xs text-zinc-400 mt-2">
        Baklol can make mistakes. Consider checking important information.
      </p>
    </div>
  );
}