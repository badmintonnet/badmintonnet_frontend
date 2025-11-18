"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  X,
  ArrowLeft,
  Send,
  User,
  ChevronDown,
  Link,
  MessageCircle,
} from "lucide-react";
import chatApiRequest from "@/apiRequest/chat";
import { ConversationType } from "@/schemaValidations/chat.schema";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
interface JwtPayload {
  sub: string;
  id: string;
  exp: number;
  iat: number;
  authorities: string[];
}
export default function ChatPanel({ onClose }: { onClose: () => void }) {
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationType | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [messages, setMessages] = useState<any[]>([]);
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [text, setText] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [subMit, setSubMit] = useState(false);
  // phân trang
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 10;

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

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
      setSubMit(!subMit);
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
  useEffect(() => {
    scrollToBottom();
  }, [subMit]);
  const loadMessages = async (
    conversationId: string,
    pageNum: number,
    append = false
  ) => {
    if (loadingMessages) return;
    setLoadingMessages(true);

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
    loadConversation();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      setPage(0);
      setHasMore(true);
      loadMessages(selectedConversation.id, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversation]);
  // useEffect(() => {
  //   const token = jwtDecode<JwtPayload>(clientSessionToken.value);

  //   // lần đầu load

  //   // kết nối websocket
  //   const socket = new SockJS(`${process.env.NEXT_PUBLIC_WS_ENDPOINT}/ws`);
  //   const stompClient = new Client({
  //     webSocketFactory: () => socket,
  //     reconnectDelay: 5000,
  //     debug: (str) => console.log("STOMP DEBUG:", str),
  //   });

  //   stompClient.onConnect = () => {
  //     console.log("Connected to WebSocket");

  //     // nhận cho riêng user
  //     stompClient.subscribe(`/topic/message/${token.id}`, (msg) => {
  //       if (msg.body) {
  //         const data = JSON.parse(msg.body);
  //         setMessages((prev) => [{ ...data, read: false }, ...prev]); // thêm vào đầu
  //       }
  //     });
  //   };

  //   stompClient.activate();

  //   return () => {
  //     stompClient.deactivate();
  //   };
  // }, []);
  return (
    <div className="flex flex-col h-full md:w-96 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="flex items-center gap-3">
          {selectedConversation && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedConversation(null)}
                className="h-8 w-8 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Image
                src={selectedConversation.avatarUrl || "/user.png"}
                alt={selectedConversation.name}
                width={36}
                height={36}
                className="rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-600"
              />
            </>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-base"
              >
                {selectedConversation ? selectedConversation.name : "Tin nhắn"}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/messages" className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Mở trang tin nhắn
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Danh sách hội thoại */}
      {!selectedConversation && (
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className="flex items-center p-4 gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200 border-b border-gray-100 dark:border-gray-800"
              onClick={() => setSelectedConversation(conversation)}
            >
              <Image
                src={conversation.avatarUrl || "/user.png"}
                alt={conversation.name}
                width={48}
                height={48}
                className="rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-600"
              />
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {conversation.name}
                </span>
                <p className="text-sm text-gray-600 dark:text-gray-300 truncate mt-1">
                  {conversation.firstMessage || "Chưa có tin nhắn"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chat view */}
      {selectedConversation && (
        <div className="flex flex-col min-h-0 bg-gray-50 dark:bg-gray-800">
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-4 space-y-4"
          >
            {messages.map((msg, i) => {
              const isMine = !msg.received;
              const showAvatar =
                msg.received &&
                (i === 0 || messages[i - 1].senderName !== msg.senderName);

              return (
                <div
                  key={msg.id}
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
                      {new Date(msg.createdAt).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex gap-2">
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Nhập tin nhắn..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={loadingMessages}
              className="flex-1 rounded-full px-4"
            />
            <Button
              onClick={sendMessage}
              disabled={!text.trim() || loadingMessages}
              className="h-10 w-10 rounded-full bg-blue-500 hover:bg-blue-600"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
