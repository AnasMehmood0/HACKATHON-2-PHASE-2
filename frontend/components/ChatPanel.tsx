// Modern AI Chat Panel Component
"use client";

import { useState, useRef, useEffect } from "react";
import { api } from "@/lib/api";
import { Bot, X, Send, Sparkles, User, Minimize2 } from "lucide-react";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  created_at: string;
  tool_calls?: any[];
}

interface ConversationResponse {
  response: string;
  conversation_id: number;
  messages: Message[];
  tool_calls: any[];
}

export function ChatPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      loadConversation();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function loadConversation() {
    // Start fresh conversation
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userMessage = message.trim();
    setMessage("");
    setLoading(true);

    // Optimistically add user message
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: "user",
        content: userMessage,
        created_at: new Date().toISOString(),
      },
    ]);

    try {
      const res = await api.post<ConversationResponse>("/api/chat", {
        message: userMessage,
        conversation_id: conversationId,
      });

      setMessages(res.messages);
      setConversationId(res.conversation_id);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "assistant",
          content: "I'm having trouble connecting. Please try again.",
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating Chat Button - Modern Design */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group fixed bottom-6 right-6 z-50"
          title="Open AI Assistant"
        >
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-300 animate-pulse" />
            {/* Button */}
            <div className="relative bg-gradient-to-r from-violet-600 to-fuchsia-600 p-4 rounded-full shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-all duration-300 hover:scale-110">
              <Bot size={24} className="text-white" strokeWidth={2} />
              {/* Online indicator */}
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-violet-600" />
            </div>
          </div>
        </button>
      )}

      {/* Chat Panel - Modern Glass Morphism */}
      {isOpen && (
        <div
          className={`fixed right-4 md:right-6 z-50 transition-all duration-300 ease-out ${
            isMinimized
              ? "bottom-6 w-auto"
              : "bottom-0 md:bottom-6 w-[calc(100%-2rem)] md:w-[420px] h-[600px] md:h-[650px]"
          }`}
        >
          <div className="h-full flex flex-col rounded-3xl overflow-hidden shadow-2xl shadow-black/50 backdrop-blur-xl bg-[#0a0a0b]/95 border border-white/10">
            {/* Header - Glass Effect */}
            <div className="relative overflow-hidden">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-fuchsia-600/20 to-violet-600/20" />
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzIuMjEgMCA0IDEuNzkgNCA0cy0xLjc5IDQtNCA0LTQtMS43OS00LTQgMS43OS00IDQtNHptMCAzMmMyLjIxIDAgNCAxLjc5IDQgNHMtMS43OSA0LTQgNC00LTEuNzktNC00IDEuNzktNCA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />

              <div className="relative flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  {/* Avatar with gradient ring */}
                  <div className="relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full blur-sm opacity-75" />
                    <div className="relative w-11 h-11 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-full flex items-center justify-center">
                      <Sparkles size={20} className="text-white" strokeWidth={2} />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-[#0a0a0b]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-base">AI Assistant</h3>
                    <p className="text-xs text-emerald-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                      Online • Powered by Gemini
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                    title={isMinimized ? "Expand" : "Minimize"}
                  >
                    <Minimize2 size={18} strokeWidth={2} />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                    title="Close"
                  >
                    <X size={18} strokeWidth={2} />
                  </button>
                </div>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* Welcome Screen */}
                  {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center py-8">
                      <div className="relative mb-6">
                        <div className="absolute -inset-3 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 rounded-full blur-2xl" />
                        <div className="relative w-20 h-20 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-3xl flex items-center justify-center shadow-xl shadow-violet-500/30">
                          <Sparkles size={36} className="text-white" strokeWidth={2} />
                        </div>
                      </div>
                      <h4 className="text-white font-semibold text-lg mb-2">Hello! I'm your AI Assistant</h4>
                      <p className="text-white/50 text-sm mb-6 max-w-[250px]">
                        I can help you manage your tasks using natural language
                      </p>
                      <div className="grid grid-cols-1 gap-2 w-full max-w-[280px]">
                        {[
                          { icon: "", text: "Add a task to buy groceries" },
                          { icon: "", text: "Show me all my pending tasks" },
                          { icon: "", text: "Complete the first task" },
                        ].map((suggestion, i) => (
                          <button
                            key={i}
                            onClick={() => setMessage(suggestion.text)}
                            className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white/70 hover:text-white text-sm text-left transition-all hover:border-white/20"
                          >
                            {suggestion.text}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Messages */}
                  {messages.map((msg, idx) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      {msg.role === "assistant" && (
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
                          <Sparkles size={16} className="text-white" strokeWidth={2} />
                        </div>
                      )}

                      <div
                        className={`max-w-[75%] rounded-3xl px-4 py-3 ${
                          msg.role === "user"
                            ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/20"
                            : "bg-white/10 text-white/90 border border-white/10"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                        {msg.tool_calls && msg.tool_calls.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-white/10">
                            <span className="text-xs opacity-60 flex items-center gap-1.5">
                              <Sparkles size={12} strokeWidth={2} />
                              Action completed
                            </span>
                          </div>
                        )}
                      </div>

                      {msg.role === "user" && (
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                          <User size={16} className="text-white" strokeWidth={2} />
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {loading && (
                    <div className="flex gap-3 justify-start">
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-xl flex items-center justify-center">
                        <Sparkles size={16} className="text-white" strokeWidth={2} />
                      </div>
                      <div className="bg-white/10 border border-white/10 rounded-3xl px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <div className="w-2 h-2 bg-fuchsia-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area - Glass Effect */}
                <div className="p-4 border-t border-white/5 bg-black/20">
                  <form onSubmit={handleSubmit} className="relative">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Ask me anything about your tasks..."
                      disabled={loading}
                      className="w-full pl-5 pr-14 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={loading || !message.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl hover:from-violet-500 hover:to-fuchsia-500 disabled:from-white/10 disabled:to-white/10 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 disabled:shadow-none"
                    >
                      <Send size={18} className="text-white" strokeWidth={2} />
                    </button>
                  </form>
                  <p className="text-center text-white/30 text-xs mt-3">
                    AI can make mistakes. Check important information.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
