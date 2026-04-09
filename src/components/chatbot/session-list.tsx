"use client";

import { Plus, MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ChatSession } from "@/components/chatbot/types";

interface SessionListProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onCreateSession: () => void;
}

function formatSessionTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
  }).format(date);
}

export function SessionList({
  sessions,
  activeSessionId,
  onSelectSession,
  onCreateSession,
}: SessionListProps) {
  return (
    <aside className="flex h-full min-h-0 flex-col border-r bg-muted/20">
      <div className="border-b p-3">
        <Button
          type="button"
          onClick={onCreateSession}
          className="h-9 w-full justify-start gap-2 bg-emerald-500 text-white hover:bg-emerald-600"
        >
          <Plus className="h-4 w-4" />
          Tạo session mới
        </Button>
      </div>

      <ScrollArea className="flex-1 min-h-0 px-2 py-2">
        <div className="space-y-1">
          {sessions.map((session) => {
            const isActive = session.sessionId === activeSessionId;
            const safeMessage = (
              session.lastMessage || "Cuoc tro chuyen"
            ).trim();
            return (
              <button
                type="button"
                key={session.sessionId}
                onClick={() => onSelectSession(session.sessionId)}
                className={cn(
                  "w-full rounded-xl border p-2.5 text-left transition",
                  isActive
                    ? "border-emerald-400 bg-emerald-50"
                    : "border-transparent bg-background hover:border-emerald-200 hover:bg-emerald-50/60",
                )}
              >
                <div className="mb-1 flex items-center gap-2">
                  <MessageSquareText className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                  <p className="line-clamp-1 text-xs font-semibold text-foreground">
                    {safeMessage.slice(0, 48)}
                  </p>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  {formatSessionTime(session.updatedAt || "")}
                  {/* {session.updatedAt} */}
                </p>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </aside>
  );
}
