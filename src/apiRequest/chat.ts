import http from "@/lib/http";
import {
  ConversationResponseType,
  MessageCreateType,
  MessageResponseType,
} from "@/schemaValidations/chat.schema";
const chatApiRequest = {
  getAllConversations: () =>
    http.get<ConversationResponseType>("/conversation"),
  sendMessage: (body: MessageCreateType) => http.post("/message", body),
  getMessagesByConversationId: (
    conversationId: string,
    page: number,
    size: number
  ) =>
    http.get<MessageResponseType>(
      `/message/${conversationId}?page=${page}&size=${size}`
    ),
};
export default chatApiRequest;
