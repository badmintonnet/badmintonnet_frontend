import Footer from "@/components/footer";
import Header from "@/components/header";
import { ChatbotWidget } from "@/components/chatbot/chatbot-widget";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="pt-16">{children}</div>
      <Footer />
      <ChatbotWidget />
    </>
  );
}
