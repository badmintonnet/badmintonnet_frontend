import http from "@/lib/http";
import { ChatbotResponseType } from "@/schemaValidations/chatbot";

const chatbotApiRequest = {
  askQuestion: (question: string, token?: string) =>
    http.post<ChatbotResponseType>(
      "/chatbot/ask",
      { question: question },
      {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      },
    ),
};
export default chatbotApiRequest;
