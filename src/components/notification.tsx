"use client";
import { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { Bell } from "lucide-react";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import { clientSessionToken } from "@/lib/http";
import {
  NotificationMessageType,
  NotificationMessagePageType,
} from "@/schemaValidations/common.schema";
import notificationApiRequest from "@/apiRequest/notification";

interface JwtPayload {
  sub: string;
  id: string;
  exp: number;
  iat: number;
  authorities: string[];
}

export default function NotificationBell() {
  const [messages, setMessages] = useState<NotificationMessageType[]>([]);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [last, setLast] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const loadingRef = useRef(false);

  const loadNotifications = async (pageNum: number) => {
    if (loadingRef.current || last) return;
    loadingRef.current = true;
    try {
      const res = await notificationApiRequest.getOldNotifications(pageNum, 10);
      const data: NotificationMessagePageType = res.payload;
      setMessages((prev) => [...prev, ...data.data.content]);
      setLast(data.data.last);
      setPage(data.data.page);
    } catch (err) {
      console.error("Lỗi khi load thông báo:", err);
    } finally {
      loadingRef.current = false;
    }
  };

  useEffect(() => {
    const token = jwtDecode<JwtPayload>(clientSessionToken.value);

    // lần đầu load
    loadNotifications(0);

    // kết nối websocket
    const socket = new SockJS(`${process.env.NEXT_PUBLIC_WS_ENDPOINT}/ws`);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => console.log("STOMP DEBUG:", str),
    });

    stompClient.onConnect = () => {
      console.log("Connected to WebSocket");

      // nhận broadcast chung
      stompClient.subscribe("/topic/notifications", (msg) => {
        if (msg.body) {
          const data = JSON.parse(msg.body);
          setMessages((prev) => [{ ...data, read: false }, ...prev]); // thêm vào đầu
        }
      });

      // nhận cho riêng user
      stompClient.subscribe(`/topic/account/${token.id}`, (msg) => {
        if (msg.body) {
          const data = JSON.parse(msg.body);
          setMessages((prev) => [{ ...data, read: false }, ...prev]); // thêm vào đầu
        }
      });
    };

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, []);

  // 📌 scroll event để load thêm
  useEffect(() => {
    if (!open || !listRef.current) return;
    const el = listRef.current;

    const handleScroll = () => {
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
        loadNotifications(page + 1);
      }
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [open, page, last]);

  const unreadCount = messages.filter((m) => !m.read).length;

  const toggleMenu = async () => {
    setOpen(!open);
    if (!open) {
      await notificationApiRequest.postReadNotifications();
      setMessages((prev) => prev.map((m) => ({ ...m, read: true })));
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={toggleMenu}
        className="relative p-2 rounded-full bg-white-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-gray-800 dark:text-gray-100" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-64 sm:w-80 max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 z-50 transform transition-all duration-300 ease-in-out">
          <div className="px-4 py-3 font-semibold text-lg text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-800">
            Thông báo
          </div>
          <ul
            ref={listRef}
            className="max-h-96 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-800"
          >
            {messages.length === 0 ? (
              <li className="p-6 text-gray-500 dark:text-gray-400 text-sm text-center">
                Không có thông báo
              </li>
            ) : (
              messages.map((m) => (
                <li
                  key={m.id}
                  className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 ${
                    m.read
                      ? "bg-white dark:bg-gray-900"
                      : "bg-gray-100 dark:bg-gray-800 font-medium"
                  }`}
                >
                  <div className="font-semibold text-gray-900 dark:text-gray-100">
                    {m.title}
                  </div>
                  <div className="mt-1 text-gray-600 dark:text-gray-300 text-sm break-words">
                    {m.content}
                  </div>
                  {m.link && (
                    <Link
                      href={m.link}
                      className="mt-2 inline-block text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpen(!open);
                      }}
                    >
                      Xem chi tiết
                    </Link>
                  )}
                </li>
              ))
            )}
            {!last && (
              <li className="p-3 text-center text-sm text-gray-500 dark:text-gray-400">
                Đang tải thêm...
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
