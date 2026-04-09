"use client";

import { useEffect, useRef } from "react";
import { Loader2, Send, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ChatMessage } from "@/components/chatbot/types";

interface ChatWindowProps {
  sessionTitle: string;
  messages: ChatMessage[];
  input: string;
  loading: boolean;
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
  onInputChange: (value: string) => void;
  onSend: () => void;
}

const markdownComponents = {
  h1: (props: React.ComponentPropsWithoutRef<"h1">) => (
    <h1
      className="mb-3 mt-4 border-b border-emerald-200/70 pb-2 text-lg font-extrabold text-slate-900 dark:border-emerald-700/60 dark:text-slate-100"
      {...props}
    />
  ),
  h2: (props: React.ComponentPropsWithoutRef<"h2">) => (
    <h2
      className="mb-2 mt-4 text-base font-bold text-slate-900 dark:text-slate-100"
      {...props}
    />
  ),
  h3: (props: React.ComponentPropsWithoutRef<"h3">) => (
    <h3
      className="mb-2 mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100"
      {...props}
    />
  ),
  p: (props: React.ComponentPropsWithoutRef<"p">) => (
    <p
      className="my-2 whitespace-pre-wrap break-words text-sm leading-7 text-slate-700 dark:text-slate-200"
      {...props}
    />
  ),
  ul: (props: React.ComponentPropsWithoutRef<"ul">) => (
    <ul
      className="my-2 list-disc space-y-1.5 pl-5 text-sm leading-7 text-slate-700 dark:text-slate-200"
      {...props}
    />
  ),
  ol: (props: React.ComponentPropsWithoutRef<"ol">) => (
    <ol
      className="my-2 list-decimal space-y-1.5 pl-5 text-sm leading-7 text-slate-700 dark:text-slate-200"
      {...props}
    />
  ),
  li: (props: React.ComponentPropsWithoutRef<"li">) => (
    <li
      className="marker:text-emerald-600 dark:marker:text-emerald-400"
      {...props}
    />
  ),
  blockquote: (props: React.ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="my-3 rounded-r-lg border-l-4 border-emerald-500 bg-emerald-50/80 px-3 py-2 text-sm italic text-slate-700 dark:bg-emerald-900/30 dark:text-slate-200"
      {...props}
    />
  ),
  a: ({ href, ...props }: React.ComponentPropsWithoutRef<"a">) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-emerald-700 underline decoration-emerald-400/70 underline-offset-4 hover:text-emerald-600 dark:text-emerald-300 dark:hover:text-emerald-200"
      {...props}
    />
  ),
  hr: (props: React.ComponentPropsWithoutRef<"hr">) => (
    <hr className="my-4 border-slate-200 dark:border-slate-700" {...props} />
  ),
  pre: (props: React.ComponentPropsWithoutRef<"pre">) => (
    <pre
      className="my-3 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-xs text-slate-100 shadow-sm"
      {...props}
    />
  ),
  code: ({ className, ...props }: React.ComponentPropsWithoutRef<"code">) => (
    <code
      className={cn(
        "rounded-md bg-emerald-50 px-1.5 py-0.5 font-mono text-[13px] text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-100",
        className && "bg-transparent px-0 py-0 text-inherit",
      )}
      {...props}
    />
  ),
  table: (props: React.ComponentPropsWithoutRef<"table">) => (
    <div className="my-3 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
      <table
        className="w-full min-w-[420px] border-collapse text-sm"
        {...props}
      />
    </div>
  ),
  thead: (props: React.ComponentPropsWithoutRef<"thead">) => (
    <thead className="bg-slate-100 dark:bg-slate-800/80" {...props} />
  ),
  tbody: (props: React.ComponentPropsWithoutRef<"tbody">) => (
    <tbody
      className="divide-y divide-slate-200 dark:divide-slate-700"
      {...props}
    />
  ),
  th: (props: React.ComponentPropsWithoutRef<"th">) => (
    <th
      className="px-3 py-2 text-left font-semibold text-slate-800 dark:text-slate-100"
      {...props}
    />
  ),
  td: (props: React.ComponentPropsWithoutRef<"td">) => (
    <td
      className="px-3 py-2 align-top text-slate-700 dark:text-slate-200"
      {...props}
    />
  ),
};

function formatMessageTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function ChatWindow({
  sessionTitle,
  messages,
  input,
  loading,
  hasMore,
  loadingMore,
  onLoadMore,
  onInputChange,
  onSend,
}: ChatWindowProps) {
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewport = viewportRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]",
    ) as HTMLElement | null;

    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, [messages, loading]);

  return (
    <section className="flex h-full min-h-0 flex-col bg-background">
      <header className="border-b bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3 text-white">
        <p className="text-sm font-semibold">{sessionTitle}</p>
        <p className="text-[11px] text-white/85">Chat theo session</p>
      </header>

      <ScrollArea
        ref={viewportRef}
        className="flex-1 min-h-0 bg-muted/20 px-3 py-3"
      >
        <div className="space-y-3">
          {hasMore && (
            <div className="flex justify-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onLoadMore}
                disabled={loadingMore}
                className="h-8"
              >
                {loadingMore ? "Đang tải..." : "Tải thêm tin nhắn cũ"}
              </Button>
            </div>
          )}

          {messages.length === 0 && (
            <div className="rounded-xl border border-dashed bg-background p-4 text-sm text-muted-foreground">
              Session này chưa có tin nhắn. Hãy bắt đầu bằng một câu hỏi.
            </div>
          )}

          {messages.map((message) => {
            const isUser = message.role === "user";
            return (
              <div
                key={message.id}
                className={cn(
                  "flex gap-2",
                  isUser ? "justify-end" : "justify-start",
                )}
              >
                {!isUser && (
                  <Avatar className="h-7 w-7 shrink-0">
                    <AvatarFallback className="bg-emerald-500 text-white">
                      <Sparkles className="h-3.5 w-3.5" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm",
                    isUser ? "bg-emerald-500 text-white" : "bg-background",
                  )}
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap break-words leading-7">
                      {message.content}
                    </p>
                  ) : (
                    <div className="chatbot-message chatbot-markdown max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={markdownComponents}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  )}
                  <p
                    className={cn(
                      "mt-1 text-[10px]",
                      isUser ? "text-white/80" : "text-muted-foreground",
                    )}
                  >
                    {formatMessageTime(message.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-emerald-500 text-white">
                  <Sparkles className="h-3.5 w-3.5" />
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-2 rounded-2xl bg-background px-3 py-2 text-xs shadow-sm">
                <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
                Đang suy nghĩ...
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <footer className="border-t bg-background px-3 py-2">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSend();
              }
            }}
            placeholder="Nhập câu hỏi của bạn..."
            className="h-10 text-sm"
            disabled={loading}
          />
          <Button
            type="button"
            onClick={onSend}
            disabled={loading || !input.trim()}
            className="h-10 bg-emerald-500 px-3 hover:bg-emerald-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </footer>
    </section>
  );
}
