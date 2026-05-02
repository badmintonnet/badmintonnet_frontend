import Footer from "@/components/footer";
import Header from "@/components/header";
import { ChatbotWidget } from "@/components/chatbot/chatbot-widget";
import { cookies } from "next/headers";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get("accessToken")?.value;

  return (
    <>
      <Header />
      <div className="pt-16">{children}</div>
      <Footer />
      <ChatbotWidget isLoggedIn={isLoggedIn} />
    </>
  );
}
