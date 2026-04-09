"use client";

import { ChatPage } from "@/components/chatbot/chat-page";

interface ChatbotInterfaceProps {
  onClose?: () => void;
}

export function ChatbotInterface(props: ChatbotInterfaceProps) {
  void props.onClose;
  return <ChatPage />;
}
