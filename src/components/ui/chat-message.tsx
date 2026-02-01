"use client";

import { motion } from "framer-motion";
import { Bot, User, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isAI = role === "assistant";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex w-full max-w-3xl mx-auto gap-4 p-4 md:p-6",
        isAI ? "bg-transparent" : "bg-transparent"
      )}
    >
      <div className="shrink-0 mt-1">
        {isAI ? (
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
            <User className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
            {isAI ? "Kurmi" : "You"}
          </span>
          {isAI && (
            <button
              onClick={handleCopy}
              className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="Copy response"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-zinc-400" />
              )}
            </button>
          )}
        </div>

        <div className="prose prose-zinc dark:prose-invert max-w-none text-sm md:text-base leading-relaxed">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    {...props}
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    className="rounded-lg mt-2! mb-2! shadow-sm"
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code
                    {...props}
                    className="bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded font-mono text-sm text-pink-500 dark:text-pink-400"
                  >
                    {children}
                  </code>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
}
