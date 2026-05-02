"use client";

import { MessageCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ChatbotWidgetProps {
  isLoggedIn: boolean;
}

export function ChatbotWidget({ isLoggedIn }: ChatbotWidgetProps) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/chatbot") {
    return null;
  }

  const handleOpenChatbot = () => {
    if (!isLoggedIn) {
      toast.error("Vui lòng đăng nhập để sử dụng chatbot.");
      router.push("/login");
      return;
    }

    router.push("/chatbot");
  };

  return (
    <Button
      onClick={handleOpenChatbot}
      className={cn(
        "fixed bottom-5 right-5 z-50 h-11 rounded-full px-3 shadow-xl",
        "bg-gradient-to-r from-emerald-500 to-teal-500",
        "hover:from-emerald-600 hover:to-teal-600",
        "transition-all duration-300 hover:scale-[1.03]",
      )}
      aria-label="Mở chatbot"
    >
      <span className="flex items-center gap-1.5 text-xs font-semibold text-white">
        <MessageCircle className="h-4 w-4" />
        <span>AI Chat</span>
      </span>
    </Button>
  );
}
