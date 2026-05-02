import { ChatPage } from "@/components/chatbot/chat-page";
import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function ChatbotPage() {
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get("accessToken")?.value;

  if (!isLoggedIn) {
    return (
      <main className="flex h-[calc(100vh-6rem)] w-full items-center justify-center bg-background px-4">
        <div className="w-full max-w-md rounded-lg border bg-card p-6 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-foreground">
            Cần đăng nhập để dùng chatbot
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Vui lòng đăng nhập để bắt đầu trò chuyện với AI Chat.
          </p>
          <Button asChild className="mt-5">
            <Link href="/login">Đăng nhập</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="h-[calc(100vh-6rem)] w-full bg-background">
      <ChatPage />
    </main>
  );
}
