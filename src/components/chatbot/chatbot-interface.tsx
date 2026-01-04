"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Loader2, Sparkles } from "lucide-react";
import chatbotApiRequest from "@/apiRequest/chatbot";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
}
function formatBotMessage(text: string) {
  let html = text;

  // Escape HTML
  html = html.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // In đậm **
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // In nghiêng *
  html = html.replace(/\*(\S.*?)\*/g, "<em>$1</em>");

  // -------- ORDERED LIST (1. 2. 3.) --------
  html = html.replace(/(?:^|\n)((?:\d+\.\s+.*(?:\n|$))+)/g, (match) => {
    const items = match
      .trim()
      .split("\n")
      .map((line) => line.replace(/^\d+\.\s+/, "").trim())
      .map((item) => `<li>${item}</li>`)
      .join("");

    return `<ol>${items}</ol>`;
  });

  // -------- UNORDERED LIST (*) --------
  html = html.replace(/(?:^|\n)((?:\*\s+.*(?:\n|$))+)/g, (match) => {
    const items = match
      .trim()
      .split("\n")
      .map((line) => line.replace(/^\*\s+/, "").trim())
      .map((item) => `<li>${item}</li>`)
      .join("");

    return `<ul>${items}</ul>`;
  });

  // Xuống dòng
  html = html.replace(/\n{2,}/g, "<br /><br />");
  html = html.replace(/\n/g, "<br />");

  return html;
}

const SUGGESTED_QUESTIONS = [
  "Làm thế nào để tạo giải đấu?",
  "Cách tham gia câu lạc bộ?",
  "Làm thế nào để cập nhật hồ sơ cá nhân?",
  "Làm thế nào để tạo và cập nhật trình độ cá nhân?",
];

export function ChatbotInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Xin chào 👋 Tôi là trợ lý ảo BadmintonNet. Tôi có thể hỗ trợ bạn về giải đấu, câu lạc bộ và đặt sân cầu lông.",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    const viewport = scrollRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]"
    ) as HTMLElement;

    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, [messages, loading]);

  /* ================= SEND ================= */
  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), text: content, sender: "user" },
    ]);
    setInput("");
    setLoading(true);

    try {
      const res = await chatbotApiRequest.askQuestion(content);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: res.payload.data.answer,
          sender: "bot",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "Xin lỗi, tôi gặp sự cố. Vui lòng thử lại sau.",
          sender: "bot",
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      {/* ================= HEADER ================= */}
      <div className="shrink-0  border-b bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 border border-white">
            <AvatarFallback className="bg-white text-emerald-600">
              <Sparkles className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-white">BadmintonNet AI</p>
            <p className="text-[10px] text-white/80">
              Trực tuyến • Sẵn sàng hỗ trợ
            </p>
          </div>
        </div>
      </div>

      {/* ================= CHAT ================= */}
      <ScrollArea
        ref={scrollRef}
        className="flex-1 min-h-0 bg-muted/20 px-4 py-3"
      >
        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "flex gap-2",
                m.sender === "user" ? "justify-end" : "justify-start"
              )}
            >
              {m.sender === "bot" && (
                <Avatar className="h-7 w-7 shrink-0">
                  <AvatarFallback className="bg-emerald-500 text-white">
                    <Sparkles className="h-3 w-3" />
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-sm",
                  m.sender === "user"
                    ? "bg-emerald-500 text-white"
                    : "bg-background"
                )}
              >
                {m.sender === "bot" ? (
                  <div className="prose prose-sm max-w-none chatbot-message">
                    <ReactMarkdown>{m.text}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {m.text}
                  </p>
                )}
              </div>
            </div>
          ))}

          {/* ===== Loading bubble ===== */}
          {loading && (
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-emerald-500 text-white">
                  <Sparkles className="h-3 w-3" />
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-2 rounded-2xl bg-background px-3 py-2 text-sm shadow-sm">
                <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
                <span className="text-muted-foreground">Đang suy nghĩ...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* ================= SUGGEST ================= */}
      {messages.length === 1 && !loading && (
        <div className="shrink-0 border-t bg-background px-3 py-2">
          <p className="mb-2 text-xs text-muted-foreground">Gợi ý câu hỏi:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="rounded-full border px-3 py-1 text-xs transition hover:bg-emerald-50 hover:text-emerald-600"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ================= INPUT ================= */}
      <div className="shrink-0 border-t bg-background px-3 py-2">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Nhập câu hỏi của bạn..."
            disabled={loading}
          />
          <Button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="bg-emerald-500 hover:bg-emerald-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="mt-1 text-center text-[10px] text-muted-foreground">
          AI có thể trả lời chưa chính xác. Vui lòng kiểm tra thông tin quan
          trọng.
        </p>
      </div>
    </div>
  );
}
