"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChatbotInterface } from "./chatbot-interface";
import { cn } from "@/lib/utils";

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className={cn(
            "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg",
            "bg-gradient-to-r from-emerald-500 to-teal-500",
            "hover:from-emerald-600 hover:to-teal-600",
            "transition-all duration-300 hover:scale-110",
            "group"
          )}
          size="icon"
        >
          <MessageCircle className="h-6 w-6 text-white group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 flex h-5 w-5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-5 w-5 rounded-full bg-emerald-500" />
          </span>
        </Button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <Card
          className={cn(
            "fixed z-50 shadow-2xl transition-all duration-300",
            "border-2",
            "bottom-6 right-6 h-[600px] w-[400px]",
            "animate-in slide-in-from-bottom-4 fade-in-0"
          )}
        >
          <div className="flex h-full flex-col relative">
            {/* Chatbot Interface */}
            <ChatbotInterface onClose={() => setIsOpen(false)} />
          </div>
        </Card>
      )}
    </>
  );
}
