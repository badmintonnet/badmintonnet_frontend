import z from "zod";

export const ChatbotRequest = z.object({
  message: z.string(),
});

export type ChatbotRequestType = z.infer<typeof ChatbotRequest>;

export const ChatbotMessageSchema = z.object({
  answer: z.string(),
});

export type ChatbotMessageType = z.infer<typeof ChatbotMessageSchema>;

export const ChatbotResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: ChatbotMessageSchema,
});

export type ChatbotResponseType = z.infer<typeof ChatbotResponse>;
