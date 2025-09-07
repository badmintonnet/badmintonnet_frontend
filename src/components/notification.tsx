"use client";
import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { Bell } from "lucide-react";
import accountApiRequest from "@/apiRequest/account";
import { clientSessionToken } from "@/lib/http";
import Link from "next/link";

type NotificationMessage = {
  id: number;
  title: string;
  content: string;
  link?: string;
  read: boolean;
};

export default function NotificationBell() {
  const [messages, setMessages] = useState<NotificationMessage[]>([]);
  const [open, setOpen] = useState(false);
  const [clubIDs, setClubIDs] = useState<string[]>([]);

  useEffect(() => {
    const fetchClubIds = async () => {
      try {
        const res = await accountApiRequest.getAllClubId(
          clientSessionToken.value
        );
        setClubIDs(res.payload.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchClubIds();
  }, []);

  useEffect(() => {
    if (clubIDs.length === 0) return;

    const socket = new SockJS(`${process.env.NEXT_PUBLIC_WS_ENDPOINT}/ws`);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => console.log("STOMP DEBUG:", str),
    });

    stompClient.onConnect = () => {
      console.log("Connected to WebSocket");

      stompClient.subscribe("/topic/notifications", (msg) => {
        if (msg.body) {
          const data = JSON.parse(msg.body);
          setMessages((prev) => [
            ...prev,
            { id: Date.now(), ...data, read: false },
          ]);
        }
      });

      clubIDs.forEach((clubId) => {
        stompClient.subscribe(`/topic/club/${clubId}`, (msg) => {
          if (msg.body) {
            const data = JSON.parse(msg.body);
            setMessages((prev) => [
              ...prev,
              { id: Date.now(), ...data, read: false },
            ]);
          }
        });
      });
    };

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [clubIDs]);

  const unreadCount = messages.filter((m) => !m.read).length;

  const toggleMenu = () => {
    setOpen(!open);
    setMessages((prev) => prev.map((m) => ({ ...m, read: true })));
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
          <ul className="max-h-96 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-800">
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
                      onClick={(e) => e.stopPropagation()}
                    >
                      Xem chi tiết
                    </Link>
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
