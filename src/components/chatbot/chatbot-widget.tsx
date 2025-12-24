"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChatbotInterface } from "./chatbot-interface";

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {!open && (
        <Button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-emerald-500 shadow-lg"
          size="icon"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      )}

      {open && (
        <Card className="fixed bottom-6 right-6 z-50 h-[520px] w-[380px] overflow-hidden shadow-xl">
          <div className="flex h-full min-h-0 flex-col">
            <div className="flex items-center justify-between border-b px-3 py-2">
              <span className="font-semibold">Chat hỗ trợ</span>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <ChatbotInterface />
          </div>
        </Card>
      )}
    </>
  );
}
