/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Search, MoreVertical } from "lucide-react";
import { ConversationType } from "@/schemaValidations/chat.schema";
import chatApiRequest from "@/apiRequest/chat";
import { jwtDecode } from "jwt-decode";
import { clientSessionToken } from "@/lib/http";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import Image from "next/image";

interface JwtPayload {
  sub: string;
  id: string;
  exp: number;
  iat: number;
  authorities: string[];
}

export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationType | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [text, setText] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const messageSubRef = useRef<any>(null);
  const pageSize = 9;
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const stompTypingRef = useRef<Client | null>(null);
  const typingSubRef = useRef<any>(null);
  const [isTypingUsers, setIsTypingUsers] = useState<string[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    if (!text.trim() || !selectedConversation) return;
    try {
      await chatApiRequest.sendMessage({
        conservationId: selectedConversation.id,
        content: text,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: text,
          senderName: "Me",
          senderAvatar: "/user.png",
          createdAt: new Date().toISOString(),
          received: false,
        },
      ]);
      setText("");
      sendTyping(false);
      setTimeout(scrollToBottom, 50);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("Lỗi khi gửi tin nhắn:", err);
    }
  };

  const loadConversation = async () => {
    try {
      const res = await chatApiRequest.getAllConversations();
      setConversations(res.payload.data);
    } catch (err) {
      console.error("Lỗi khi load hội thoại:", err);
    }
  };

  const loadMessages = async (
    conversationId: string,
    pageNum: number,
    append = false,
  ) => {
    if (loadingMessages) return;
    setLoadingMessages(true);
    if (append) setLoadingMore(true);

    try {
      const res = await chatApiRequest.getMessagesByConversationId(
        conversationId,
        pageNum,
        pageSize,
      );

      const newMessages = res.payload.data.content.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );

      if (newMessages.length < pageSize) {
        setHasMore(false);
      }

      if (append) {
        const container = scrollContainerRef.current;
        const oldHeight = container?.scrollHeight || 0;

        setMessages((prev) => [...newMessages, ...prev]);

        setTimeout(() => {
          if (container) {
            const newHeight = container.scrollHeight;
            container.scrollTop = newHeight - oldHeight;
          }
        }, 50);
      } else {
        setMessages(newMessages);
        setTimeout(() => scrollToBottom(), 100);
      }
    } catch (err) {
      console.error("Lỗi khi load tin nhắn:", err);
    } finally {
      setLoadingMessages(false);
      if (append) setLoadingMore(false);
    }
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current || loadingMessages || !hasMore) return;

    if (scrollContainerRef.current.scrollTop === 0 && selectedConversation) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadMessages(selectedConversation.id, nextPage, true);
    }
  };

  useEffect(() => {
    loadConversation();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      setPage(0);
      setHasMore(true);
      loadMessages(selectedConversation.id, 0);
    } else {
      // clear messages when no conversation selected to avoid large memory
      setMessages([]);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversation]);

  // WebSocket conversation updates
  useEffect(() => {
    const token = jwtDecode<JwtPayload>(clientSessionToken.value);

    const socket = new SockJS(`${process.env.NEXT_PUBLIC_WS_ENDPOINT}/ws`);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => console.log("STOMP DEBUG:", str),
    });

    stompClient.onConnect = () => {
      stompClient.subscribe(`/topic/conversation/update/${token.id}`, (msg) => {
        if (msg.body) {
          const updated = JSON.parse(msg.body);
          if (selectedConversation?.id === updated.id) {
            return;
          }
          setConversations((prev) => {
            const index = prev.findIndex((c) => c.id === updated.id);
            let newList = [...prev];

            if (index !== -1) {
              newList[index] = { ...newList[index], ...updated };
              const [updatedConv] = newList.splice(index, 1);
              newList = [updatedConv, ...newList];
            } else {
              newList = [updated, ...newList];
            }
            return newList;
          });
        }
      });
    };

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [selectedConversation]);

  // WebSocket messages
  useEffect(() => {
    if (!selectedConversation) return;
    if (messageSubRef.current) {
      messageSubRef.current.unsubscribe();
    }
    const socket = new SockJS(`${process.env.NEXT_PUBLIC_WS_ENDPOINT}/ws`);
    const token = jwtDecode<JwtPayload>(clientSessionToken.value);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => console.log("STOMP DEBUG:", str),
    });

    stompClient.onConnect = () => {
      messageSubRef.current = stompClient.subscribe(
        `/topic/message/${selectedConversation.id}/${token.id}`,
        (msg) => {
          if (msg.body) {
            const newMsg = JSON.parse(msg.body);
            setMessages((prev) => [...prev, newMsg]);
            setTimeout(scrollToBottom, 50);
            setPage((prev) => prev + 1);
          }
        },
      );
    };

    stompClient.activate();

    return () => {
      if (messageSubRef.current) {
        messageSubRef.current.unsubscribe();
        messageSubRef.current = null;
      }
      stompClient.deactivate();
    };
  }, [selectedConversation]);

  // WebSocket typing
  useEffect(() => {
    if (!selectedConversation) return;

    const socket = new SockJS(`${process.env.NEXT_PUBLIC_WS_ENDPOINT}/ws`);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => console.log("STOMP TYPING DEBUG:", str),
    });

    stompClient.onConnect = () => {
      const token = jwtDecode<JwtPayload>(clientSessionToken.value);
      typingSubRef.current?.unsubscribe();

      typingSubRef.current = stompClient.subscribe(
        `/topic/typing/${selectedConversation.id}/${token.id}`,
        (msg) => {
          if (msg.body) {
            const event = JSON.parse(msg.body);
            const senderId = event.senderId;
            // scrollToBottom();
            setIsTypingUsers((prev) => {
              if (event.typing) {
                if (!prev.includes(senderId)) return [...prev, senderId];
              } else {
                return prev.filter((id) => id !== senderId);
              }
              return prev;
            });
          }
        },
      );
    };

    stompClient.activate();
    stompTypingRef.current = stompClient;

    return () => {
      typingSubRef.current?.unsubscribe();
      stompTypingRef.current?.deactivate();
      stompTypingRef.current = null;
    };
  }, [selectedConversation]);

  const sendTyping = (typing: boolean) => {
    if (!selectedConversation) return;
    const token = jwtDecode<JwtPayload>(clientSessionToken.value);

    stompTypingRef.current?.publish({
      destination: "/app/typing",
      body: JSON.stringify({
        senderId: token.id,
        conversationId: selectedConversation.id,
        typing,
      }),
    });
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    // full viewport and prevent whole-page scroll; let inner panes scroll independently
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Sidebar - Danh sách hội thoại */}
      <aside className="w-full md:w-96 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col min-h-0">
        {/* Header Sidebar (fixed) */}
        <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Tin nhắn
          </h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm cuộc trò chuyện..."
              className="pl-10 rounded-full"
            />
          </div>
        </div>

        {/* Danh sách cuộc trò chuyện (scroll only this pane) */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 p-8">
              <p className="text-center">Không tìm thấy cuộc trò chuyện nào</p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`flex items-center p-4 gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200 border-b border-gray-100 dark:border-gray-700 relative ${
                  selectedConversation?.id === conversation.id
                    ? "bg-blue-50 dark:bg-blue-900/20"
                    : ""
                }`}
                onClick={() => {
                  setConversations((prev) =>
                    prev.map((c) =>
                      c.id === conversation.id ? { ...c, unreadCount: 0 } : c,
                    ),
                  );
                  setSelectedConversation(conversation);
                }}
              >
                <div className="relative w-12 h-12 flex-shrink-0">
                  <Image
                    src={conversation.avatarUrl || "/user.png"}
                    alt={conversation.name}
                    fill
                    sizes="48px"
                    className="rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-600"
                    quality={100}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {conversation.name}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                    {conversation.firstMessage || "Chưa có tin nhắn"}
                  </p>
                </div>

                {conversation.unreadCount > 0 && (
                  <span className="bg-blue-500 text-white text-xs font-semibold rounded-full px-2 py-1">
                    {conversation.unreadCount}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col overflow-hidden min-h-0">
        {!selectedConversation ? (
          <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-8">
            <div className="text-center text-gray-500 dark:text-gray-400 max-w-lg">
              <div className="w-36 h-36 mx-auto mb-4 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <Search className="w-14 h-14" />
              </div>
              <h2 className="text-xl font-semibold mb-2">
                Chọn một cuộc trò chuyện
              </h2>
              <p className="text-sm">
                Chọn từ danh sách bên trái để bắt đầu nhắn tin
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header (fixed) */}
            <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedConversation(null)}
                  className="md:hidden"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="relative w-10 h-10">
                  <Image
                    src={selectedConversation.avatarUrl || "/user.png"}
                    alt={selectedConversation.name}
                    fill
                    sizes="40px"
                    className="rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-600"
                    quality={100}
                  />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    {selectedConversation.name}
                  </h2>
                  {selectedConversation.groupChat && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Nhóm chat
                    </p>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages (scroll only this area) */}
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900 min-h-0"
            >
              {loadingMore && (
                <div className="flex justify-center py-2">
                  <svg
                    className="animate-spin h-6 w-6 text-blue-500"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                </div>
              )}

              {messages.map((msg, i) => {
                const isMine = !msg.received;
                const showAvatar =
                  msg.received &&
                  (i === messages.length - 1 ||
                    messages[i + 1].senderName !== msg.senderName);

                const showSenderName =
                  selectedConversation.groupChat &&
                  msg.received &&
                  (i === 0 || messages[i - 1].senderName !== msg.senderName);

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      !isMine ? "items-start" : "items-end"
                    }`}
                  >
                    {showSenderName && (
                      <span className="ml-12 text-xs font-semibold text-blue-600 mt-3 mb-2">
                        {msg.senderName}
                      </span>
                    )}
                    <div
                      className={`flex items-end gap-3 ${
                        isMine ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!isMine &&
                        (showAvatar ? (
                          <Image
                            src={msg.senderAvatar || "/user.png"}
                            alt={msg.senderName}
                            width={32}
                            height={32}
                            className="rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-600"
                          />
                        ) : (
                          <div className="w-8" />
                        ))}
                      <div
                        className={`p-3 rounded-2xl max-w-[75%] text-sm shadow-sm ${
                          isMine
                            ? "bg-blue-500 text-white"
                            : "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        }`}
                      >
                        <p>{msg.content}</p>
                        <span className="text-xs block text-right opacity-70 mt-1">
                          {new Date(msg.createdAt).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {isTypingUsers.length > 0 && (
                <div className="flex items-center gap-2 pl-2 py-1">
                  <svg
                    className="w-4 h-4 text-blue-400 animate-pulse"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="5" cy="12" r="2" fill="currentColor" />
                    <circle cx="12" cy="12" r="2" fill="currentColor" />
                    <circle cx="19" cy="12" r="2" fill="currentColor" />
                  </svg>
                  <span className="text-blue-500 text-sm font-medium animate-pulse">
                    {isTypingUsers.length === 1
                      ? "Đang soạn..."
                      : "Nhiều người đang gõ..."}
                  </span>
                </div>
              )}

              {/* <div ref={messagesEndRef} /> */}
            </div>

            {/* Input (fixed) */}
            <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex gap-3 items-center">
                <Input
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    sendTyping(!!e.target.value);
                  }}
                  placeholder="Nhập tin nhắn..."
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  disabled={loadingMessages}
                  className="flex-1 rounded-full px-4"
                />
                <button
                  onClick={sendMessage}
                  disabled={!text.trim() || loadingMessages}
                  className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 dark:disabled:from-gray-700 dark:disabled:to-gray-600 transition-all duration-200 active:scale-95 group relative flex items-center justify-center"
                  style={{
                    boxShadow:
                      text.trim() && !loadingMessages
                        ? "0 8px 16px rgba(59, 130, 246, 0.4), inset 0 -2px 4px rgba(0, 0, 0, 0.2), inset 0 2px 4px rgba(255, 255, 255, 0.3)"
                        : "0 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Send className="w-5 h-5 text-white group-disabled:text-gray-500 drop-shadow-lg" />
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
