"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import ChatPanel from "@/components/chat/chat-panel";

export default function ChatButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
        onClick={() => setOpen(!open)}
      >
        <MessageCircle className="w-5 h-5" />
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-96 h-[600px] bg-white dark:bg-gray-900 shadow-xl rounded-lg border border-gray-200 dark:border-gray-700 z-50">
          <ChatPanel onClose={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}
