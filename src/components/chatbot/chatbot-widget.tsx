"use client";

import { useState } from "react";
import { MessageCircle, X, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChatbotInterface } from "./chatbot-interface";
import { cn } from "@/lib/utils";

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

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
            isMinimized
              ? "bottom-6 right-6 h-14 w-80"
              : "bottom-6 right-6 h-[600px] w-[400px]",
            "animate-in slide-in-from-bottom-4 fade-in-0"
          )}
        >
          {isMinimized ? (
            // Minimized State
            <div className="flex h-full items-center justify-between bg-gradient-to-r from-emerald-500 to-teal-500 px-4">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-white" />
                <span className="font-semibold text-white">
                  Trợ lý SportsNet
                </span>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/20"
                  onClick={() => setIsMinimized(false)}
                >
                  <Minimize2 className="h-4 w-4 rotate-180" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/20"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            // Full State
            <div className="flex h-full flex-col">
              {/* Window Controls */}
              <div className="absolute right-2 top-2 z-10 flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/20"
                  onClick={() => setIsMinimized(true)}
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/20"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Chatbot Interface */}
              <ChatbotInterface />
            </div>
          )}
        </Card>
      )}
    </>
  );
}
