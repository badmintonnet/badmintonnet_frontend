import http from "@/lib/http";
import { ChatbotResponseType } from "@/schemaValidations/chatbot";

const chatbotApiRequest = {
  askQuestion: (question: string) =>
    http.post<ChatbotResponseType>("/chatbot/ask", { message: question }),
};
export default chatbotApiRequest;
