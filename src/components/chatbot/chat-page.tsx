"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import chatbotSessionApi from "@/apiRequest/chatbot-session";
import { ChatMessage, ChatSession } from "@/components/chatbot/types";
import { ChatWindow } from "@/components/chatbot/chat-window";
import { SessionList } from "@/components/chatbot/session-list";

const STORAGE_SESSION_KEY = "chatbot:activeSessionId";
const MESSAGE_PAGE_SIZE = 20;

const mergeMessagesUnique = (
  current: ChatMessage[],
  incoming: ChatMessage[],
) => {
  const map = new Map<string, ChatMessage>();

  [...current, ...incoming].forEach((message) => {
    map.set(message.id, message);
  });

  return Array.from(map.values()).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
};

export function ChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const loadSessions = useCallback(async (preferredSessionId?: string) => {
    const res = await chatbotSessionApi.getSessions();
    const safeSessions = Array.isArray(res.payload) ? res.payload : [];
    setSessions(safeSessions);

    const savedSessionId = localStorage.getItem(STORAGE_SESSION_KEY);
    const nextSessionId =
      preferredSessionId ||
      (savedSessionId &&
      safeSessions.some((s) => s.sessionId === savedSessionId)
        ? savedSessionId
        : safeSessions[0]?.sessionId || null);

    if (nextSessionId) {
      setActiveSessionId(nextSessionId);
    }

    return safeSessions;
  }, []);

  const loadSessionMessages = useCallback(
    async (
      sessionId: string,
      targetPage: number,
      mode: "replace" | "append" = "replace",
    ) => {
      const res = await chatbotSessionApi.getSessionDetail(sessionId, {
        page: targetPage,
        size: MESSAGE_PAGE_SIZE,
      });

      if (mode === "replace") {
        setMessages(res.payload.messages);
      } else {
        setMessages((prev) => mergeMessagesUnique(prev, res.payload.messages));
      }

      setPage(targetPage);
      setHasMore(res.payload.hasMore);
    },
    [],
  );

  // Load sessions on mount
  useEffect(() => {
    const bootstrapSessions = async () => {
      try {
        await loadSessions();
      } catch (error) {
        console.error("Failed to load sessions:", error);
        toast.error("Không thể tải danh sách chat");
      }
    };

    bootstrapSessions();
  }, [loadSessions]);

  // Load session detail when active session changes
  useEffect(() => {
    if (!activeSessionId) {
      setMessages([]);
      setPage(0);
      setHasMore(false);
      return;
    }

    const loadSessionDetail = async () => {
      setLoadingHistory(true);
      try {
        await loadSessionMessages(activeSessionId, 0, "replace");
      } catch (error) {
        console.error("Failed to load session detail:", error);
        toast.error("Không thể tải lịch sử chat");
      } finally {
        setLoadingHistory(false);
      }
    };

    loadSessionDetail();
  }, [activeSessionId, loadSessionMessages]);

  // Persist active session to localStorage
  useEffect(() => {
    if (activeSessionId) {
      localStorage.setItem(STORAGE_SESSION_KEY, activeSessionId);
    }
  }, [activeSessionId]);

  const handleCreateSession = useCallback(() => {
    setActiveSessionId(null);
    setMessages([]);
    setInput("");
    localStorage.removeItem(STORAGE_SESSION_KEY);
  }, []);

  const handleSelectSession = useCallback((sessionId: string) => {
    setActiveSessionId(sessionId);
  }, []);

  const handleSend = useCallback(async () => {
    if (!input.trim() || loading) return;

    const question = input;
    setInput("");
    setLoading(true);

    // Add user message optimistically
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: question,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      // Send message to API
      const res = await chatbotSessionApi.ask({
        sessionId: activeSessionId || "",
        question,
      });

      const responseSessionId = res.payload.sessionId;

      const targetSessionId = responseSessionId || activeSessionId || "";
      if (!targetSessionId) {
        throw new Error("Missing session id after sending message");
      }

      setActiveSessionId(targetSessionId);

      // Reload both session list and first page of messages after each send.
      await Promise.all([
        loadSessions(targetSessionId),
        loadSessionMessages(targetSessionId, 0, "replace"),
      ]);
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Gửi tin nhắn thất bại. Vui lòng thử lại.");
      // Remove user message on error
      setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
      setInput(question);
    } finally {
      setLoading(false);
    }
  }, [activeSessionId, input, loadSessionMessages, loadSessions, loading]);

  const handleLoadMore = useCallback(async () => {
    if (!activeSessionId || loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      await loadSessionMessages(activeSessionId, page + 1, "append");
    } catch (error) {
      console.error("Failed to load more messages:", error);
      toast.error("Không thể tải thêm tin nhắn");
    } finally {
      setLoadingMore(false);
    }
  }, [activeSessionId, hasMore, loadSessionMessages, loadingMore, page]);

  const activeSession = useMemo(
    () =>
      Array.isArray(sessions)
        ? sessions.find((s) => s.sessionId === activeSessionId)
        : undefined,
    [activeSessionId, sessions],
  );

  return (
    <div className="grid h-full min-h-0 grid-cols-1 md:grid-cols-[280px_1fr]">
      <SessionList
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onCreateSession={handleCreateSession}
      />

      <ChatWindow
        sessionTitle={(activeSession?.lastMessage || "Chat mới").trim()}
        messages={messages}
        input={input}
        loading={loading || loadingHistory}
        hasMore={hasMore}
        loadingMore={loadingMore}
        onLoadMore={handleLoadMore}
        onInputChange={setInput}
        onSend={handleSend}
      />
    </div>
  );
}
