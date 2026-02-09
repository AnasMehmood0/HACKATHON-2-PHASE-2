// Chat Panel Component with premium dark theme
"use client";

import { useState, useRef, useEffect } from "react";
import { api } from "@/lib/api";
import { MessageSquare, X, Send, Sparkles } from "lucide-react";

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
          content: "I'm having trouble connecting. Please make sure the backend is running.",
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-[#D4FF5E] text-[#0F0F0F] p-4 rounded-2xl shadow-2xl shadow-[#D4FF5E]/30 hover:bg-[#D4FF5E]/90 hover:shadow-[#D4FF5E]/50 transition-all z-40 hover:scale-105"
          title="Open AI Assistant"
        >
          <MessageSquare size={24} className="text-[#0F0F0F]" strokeWidth={2} />
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-0 right-0 w-full md:w-96 h-[500px] bg-[#1C1C1C] border-l border-t border-white/5 shadow-2xl flex flex-col z-50 rounded-t-3xl md:rounded-tl-3xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Sparkles size={16} className="text-white" strokeWidth={2} />
              </div>
              <h3 className="font-semibold text-white">AI Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
            >
              <X size={18} strokeWidth={2} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <div className="w-12 h-12 bg-[#1C1C1C] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MessageSquare size={24} className="text-gray-600" />
                </div>
                <p className="text-sm">Chat with AI to manage your tasks</p>
                <p className="text-xs text-gray-600 mt-2">Try: "Add a task to buy groceries"</p>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-[#D4FF5E] text-[#0F0F0F]"
                      : "bg-[#0F0F0F] text-gray-200 border border-white/10"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  {msg.tool_calls && msg.tool_calls.length > 0 && (
                    <p className="text-xs opacity-70 mt-1">
                      ✓ Used {msg.tool_calls.length} tool{msg.tool_calls.length > 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#0F0F0F] border border-white/10 rounded-2xl px-4 py-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-[#D4FF5E] rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-[#D4FF5E] rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-[#D4FF5E] rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-white/5">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask AI to manage tasks..."
                disabled={loading}
                className="flex-1 px-4 py-3 bg-[#0F0F0F] border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-[#D4FF5E]/50 transition-colors"
              />
              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="px-4 py-3 bg-[#D4FF5E] text-[#0F0F0F] rounded-2xl hover:bg-[#D4FF5E]/90 disabled:bg-gray-700 disabled:cursor-not-allowed transition-all flex items-center justify-center"
              >
                <Send size={18} strokeWidth={2} />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
