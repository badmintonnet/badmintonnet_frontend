/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, MessageSquare, X, ArrowLeft, Send } from "lucide-react";
import { useRouter } from "next/navigation";
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

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationType | null>(null);
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [text, setText] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [unread, setUnread] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const messageSubRef = useRef<any>(null);
  const pageSize = 30;
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const stompTypingRef = useRef<Client | null>(null);
  const typingSubRef = useRef<any>(null);
  const [isTypingUsers, setIsTypingUsers] = useState<string[]>([]); // danh sách user đang typing
  const [searchTerm, setSearchTerm] = useState("");

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
      const totalUnread = res.payload.data.reduce(
        (sum, c) => sum + (c.unreadCount || 0),
        0
      );
      setUnread(totalUnread);
    } catch (err) {
      console.error("Lỗi khi load hội thoại:", err);
    }
  };

  const loadMessages = async (
    conversationId: string,
    pageNum: number,
    append = false
  ) => {
    if (loadingMessages) return;
    setLoadingMessages(true);
    if (append) setLoadingMore(true);

    try {
      const res = await chatApiRequest.getMessagesByConversationId(
        conversationId,
        pageNum,
        pageSize
      );

      const newMessages = res.payload.data.content.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      if (newMessages.length < pageSize) {
        setHasMore(false); // hết dữ liệu
      }

      if (append) {
        // giữ vị trí scroll khi load thêm
        const container = scrollContainerRef.current;
        const oldHeight = container?.scrollHeight || 0;

        setMessages((prev) => [...newMessages, ...prev]);

        setTimeout(() => {
          if (container) {
            const newHeight = container.scrollHeight;
            container.scrollTop = newHeight - oldHeight; // giữ nguyên vị trí cũ
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

    // Nếu kéo lên đầu thì load thêm
    if (scrollContainerRef.current.scrollTop === 0 && selectedConversation) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadMessages(selectedConversation.id, nextPage, true);
    }
  };

  useEffect(() => {
    if (open) {
      loadConversation();
    }
  }, [open]);
  useEffect(() => {
    loadConversation();
  }, []);
  useEffect(() => {
    if (selectedConversation) {
      setPage(0);
      setHasMore(true);
      loadMessages(selectedConversation.id, 0);
    }
  }, [selectedConversation]);

  // WebSocket kết nối và thông báo
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
        console.log(
          "Viewing this conversation, no notification needed",
          selectedConversation
        );
        if (msg.body) {
          const updated = JSON.parse(msg.body);
          if (selectedConversation?.id === updated.id) {
            console.log("Viewing this conversation, no notification needed");
            return; // nếu đang xem hội thoại này thì không thông báo
          } else {
            setConversations((prev) => {
              const index = prev.findIndex((c) => c.id === updated.id);
              let newList = [...prev];

              if (index !== -1) {
                // cập nhật hội thoại cũ
                newList[index] = { ...newList[index], ...updated };

                // đưa hội thoại vừa cập nhật lên đầu danh sách
                const [updatedConv] = newList.splice(index, 1);
                newList = [updatedConv, ...newList];
              } else {
                // thêm hội thoại mới vào đầu
                newList = [updated, ...newList];
              }
              const totalUnread = newList.reduce(
                (sum, c) => sum + (c.unreadCount || 0),
                0
              );
              setUnread(totalUnread);
              return newList;
            });
          }
        }
      });
    };

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [selectedConversation]);
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
      console.log("Connected to WebSocket message channel");

      // 🔴 Lắng nghe tin nhắn realtime của hội thoại đang mở
      messageSubRef.current = stompClient.subscribe(
        `/topic/message/${selectedConversation.id}/${token.id}`,
        (msg) => {
          if (msg.body) {
            const newMsg = JSON.parse(msg.body);
            setMessages((prev) => [...prev, newMsg]); // append vào cuối
            setTimeout(scrollToBottom, 50);
            setPage((prev) => prev + 1);
          }
        }
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

  useEffect(() => {
    if (!selectedConversation) return;

    const socket = new SockJS(`${process.env.NEXT_PUBLIC_WS_ENDPOINT}/ws`);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => console.log("STOMP TYPING DEBUG:", str),
    });

    stompClient.onConnect = () => {
      console.log("Connected to typing WebSocket");
      const token = jwtDecode<JwtPayload>(clientSessionToken.value);
      // unsubscribe nếu trước đó có
      typingSubRef.current?.unsubscribe();

      // subscribe topic typing
      typingSubRef.current = stompClient.subscribe(
        `/topic/typing/${selectedConversation.id}/${token.id}`,
        (msg) => {
          if (msg.body) {
            const event = JSON.parse(msg.body);
            const senderId = event.senderId;
            scrollToBottom();
            setIsTypingUsers((prev) => {
              if (event.typing) {
                if (!prev.includes(senderId)) return [...prev, senderId];
              } else {
                return prev.filter((id) => id !== senderId);
              }
              return prev;
            });
          }
        }
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
      destination: "/app/typing", // URL BE dùng @MessageMapping("/typing")
      body: JSON.stringify({
        senderId: token.id,
        conversationId: selectedConversation.id,
        typing,
      }),
    });
  };
  return (
    <div className="relative">
      {/* Nút mở */}
      {/* Nút mở + chuyển tới trang Tin nhắn */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 relative"
          onClick={() => setOpen(!open)}
          aria-label="Mở widget Tin nhắn"
          title="Mở widget Tin nhắn"
        >
          <MessageCircle className="w-5 h-5" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
              {unread}
            </span>
          )}
        </Button>
      </div>

      {open && (
        <div className="absolute right-0 mt-2 w-118 h-[600px] bg-white dark:bg-gray-900 shadow-xl rounded-lg border border-gray-200 dark:border-gray-700 z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
            <div className="flex items-center gap-3">
              {selectedConversation && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      loadConversation();
                      setSelectedConversation(null);
                    }}
                    className="h-8 w-8 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <div className="relative w-8 h-8">
                    <Image
                      src={selectedConversation?.avatarUrl || "/user.png"}
                      alt={selectedConversation?.name || "Avatar"}
                      fill
                      sizes="64px"
                      className="rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-600 transition-transform hover:scale-105 duration-200"
                      quality={100}
                      placeholder="blur"
                      blurDataURL="/user.png"
                    />
                  </div>
                </>
              )}

              <Button
                variant="ghost"
                size="sm"
                // onClick={() => {
                //   setOpen(false);
                //   router.push("/chat");
                // }}
                className="hidden sm:inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200 
             px-3 py-1 rounded-md font-medium transition-all duration-200 
             hover:bg-gray-100 dark:hover:bg-gray-800 
             hover:text-gray-900 dark:hover:text-white 
             hover:scale-[1.03] active:scale-[0.98]"
                aria-label="Mở trang Tin nhắn"
                title="Mở trang Tin nhắn"
              >
                {!selectedConversation && (
                  <MessageSquare className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                )}
                <span>
                  {selectedConversation
                    ? selectedConversation?.name
                    : "Tin nhắn"}
                </span>
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedConversation(null);
                setOpen(false);
              }}
              className="h-8 w-8 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Danh sách hội thoại */}
          {!selectedConversation && (
            <div className="flex-1 overflow-y-auto">
              <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm hội thoại..."
                  className="w-full rounded-full px-4 py-2 text-sm bg-white dark:bg-gray-900"
                />
              </div>

              {conversations
                .filter((conversation) =>
                  conversation.name
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase().trim())
                )
                .map((conversation) => (
                  <div
                    key={conversation.id}
                    className="flex items-center p-4 gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200 border-b border-gray-100 dark:border-gray-800 relative"
                    onClick={() => {
                      setUnread((u) => u - conversation.unreadCount);
                      setConversations((prev) =>
                        prev.map((c) =>
                          c.id === conversation.id
                            ? { ...c, unreadCount: 0 }
                            : c
                        )
                      );
                      setSelectedConversation(conversation);
                    }}
                  >
                    <div className="relative w-12 h-12">
                      <Image
                        src={conversation.avatarUrl || "/user.png"}
                        alt={conversation.name}
                        fill
                        sizes="56px"
                        className="rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-600 transition-transform hover:scale-105 duration-200"
                        quality={100}
                        placeholder="blur"
                        blurDataURL="/user.png"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {conversation.name}
                      </span>
                      <p className="text-sm text-gray-600 dark:text-gray-300 truncate mt-1">
                        {conversation.firstMessage || "Chưa có tin nhắn"}
                      </p>
                    </div>

                    {conversation.unreadCount > 0 && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-semibold rounded-full px-2 py-0.5">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                ))}
            </div>
          )}

          {/* Chat view */}
          {selectedConversation && (
            <div className="flex flex-col min-h-0 bg-gray-50 dark:bg-gray-800 h-full">
              <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0"
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

                  // Hiển thị tên nếu là nhóm và là tin đầu tiên của người gửi này (so với tin trước đó)
                  const showSenderName =
                    selectedConversation.groupChat &&
                    msg.received &&
                    (i === 0 || messages[i - 1].senderName !== msg.senderName);

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col items-end ${
                        !isMine ? "items-start" : ""
                      } gap-0.5`}
                    >
                      {showSenderName && (
                        <span className="ml-12 text-xs font-semibold text-blue-600  mt-3 mb-2">
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
                              ? "bg-blue-500 text-white ml-8"
                              : "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 mr-8"
                          }`}
                        >
                          <p>{msg.content}</p>
                          <span className="text-xs block text-right opacity-70">
                            {new Date(msg.createdAt).toLocaleTimeString(
                              "vi-VN",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {isTypingUsers.length > 0 && (
                  <div className="text-sm pl-4 text-gray-500 h-5">
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
                          : `Nhiều người đang gõ...`}
                      </span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex gap-2">
                <Input
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    sendTyping(!!e.target.value); // typing true nếu có input
                  }}
                  placeholder="Nhập tin nhắn..."
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  disabled={loadingMessages}
                  className="flex-1 mt-1.5 rounded-full px-4"
                />
                <button
                  onClick={sendMessage}
                  disabled={!text.trim() || loadingMessages}
                  className="h-12 w-12 mb-1 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 dark:disabled:from-gray-700 dark:disabled:to-gray-600 transition-all duration-200 active:scale-95  group relative"
                  style={{
                    boxShadow:
                      text.trim() && !loadingMessages
                        ? "0 8px 16px rgba(59, 130, 246, 0.4), inset 0 -2px 4px rgba(0, 0, 0, 0.2), inset 0 2px 4px rgba(255, 255, 255, 0.3)"
                        : "0 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Send className="w-5 h-5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white group-disabled:text-gray-500 drop-shadow-lg" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
