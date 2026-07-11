"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const suggestedQuestions = [
  "How can I improve my email open rates?",
  "What makes a good cold email?",
  "How do I score leads effectively?",
  "Best practices for follow-ups?",
];

export function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I'm your AI sales assistant. I can help you with email writing, lead scoring, outreach strategies, and more. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI response - in production, this would call an API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes("email") && (lowerMessage.includes("open") || lowerMessage.includes("rate"))) {
      return "To improve email open rates: 1) Craft compelling subject lines with personalization (use their name or company). 2) Send at optimal times (Tuesday-Thursday, 10am-2pm). 3) Keep subject lines under 40 characters. 4) A/B test different approaches. 5) Ensure your sender reputation is strong. LeadPilot's AI can help generate personalized subject lines for each lead.";
    }

    if (lowerMessage.includes("cold email") || lowerMessage.includes("good email")) {
      return "A great cold email should: 1) Be concise (under 150 words). 2) Lead with value, not your product. 3) Personalize based on their business (use our AI audit feature!). 4) Have a clear, single CTA. 5) Include social proof. 6) Follow up 2-3 times. Our AI Email Generator creates personalized drafts based on each lead's business profile.";
    }

    if (lowerMessage.includes("score") || lowerMessage.includes("lead")) {
      return "Effective lead scoring considers: 1) Online presence (website quality, social media). 2) Review ratings and count. 3) Industry fit with your ICP. 4) Company size. 5) Engagement signals. Use our AI Lead Scoring feature (Brain icon on each lead) to get instant scores with detailed factors. Focus on leads scoring 70+.";
    }

    if (lowerMessage.includes("follow")) {
      return "Follow-up best practices: 1) Wait 3-5 days between follow-ups. 2) Add new value in each message (share a relevant article, case study). 3) Keep it shorter than the original. 4) Try different angles (pain point, social proof, urgency). 5) Stop after 3-4 attempts. Our AI Follow-up Generator creates contextual follow-ups based on your previous emails.";
    }

    return "Great question! Here are some key insights: 1) Personalization increases response rates by 3x. 2) Use our AI Website Audit to find talking points for each lead. 3) Track your metrics in the Analytics dashboard. 4) Focus on one industry at a time for better messaging. 5) Use the CRM pipeline to stay organized. Is there a specific area you'd like to dive deeper into?";
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await generateResponse(userMessage.content);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (question: string) => {
    setInput(question);
  };

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all group"
          aria-label="Open AI Assistant"
        >
          <MessageSquare size={24} className="group-hover:scale-110 transition-transform" />
          <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 border-2 border-white dark:border-slate-900">
            <Sparkles size={10} className="text-white" />
          </div>
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[600px] w-[400px] max-w-[calc(100vw-3rem)] flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                <Bot size={18} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">AI Sales Assistant</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Powered by LeadPilot AI</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {message.role === "user" ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                    message.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-sm"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-sm"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  <Bot size={14} />
                </div>
                <div className="rounded-2xl rounded-tl-sm bg-slate-100 dark:bg-slate-800 px-4 py-3">
                  <Loader2 size={16} className="animate-spin text-slate-400" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {messages.length === 1 && (
            <div className="px-5 pb-3">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Suggested questions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question) => (
                  <button
                    key={question}
                    onClick={() => handleSuggestionClick(question)}
                    className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-slate-200 dark:border-slate-800 px-5 py-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder="Ask me anything about sales..."
                className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
