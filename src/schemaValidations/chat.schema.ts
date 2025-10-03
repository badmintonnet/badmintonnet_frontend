import z, { array } from "zod";
export const conversation = z.object({
  id: z.string(),
  name: z.string(),
  firstMessage: z.string(),
  avatarUrl: z.string().nullable(),
  unreadCount: z.number(),
});
export const conversationResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(conversation),
});

export type ConversationType = z.infer<typeof conversation>;
export type ConversationResponseType = z.infer<typeof conversationResponse>;

export const messageCreate = z.object({
  conservationId: z.string(),
  content: z.string().min(1, { message: "Nội dung không được để trống" }),
});
export type MessageCreateType = z.infer<typeof messageCreate>;

export const message = z.object({
  id: z.string(),
  content: z.string(),
  senderName: z.string(),
  senderAvatar: z.string().nullable(),
  createdAt: z.coerce.date(),
  received: z.boolean(),
});

export const messageResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: z.object({
    content: z.array(message),
    page: z.number(),
    size: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
    last: z.boolean(),
  }),
});

export type MessageType = z.infer<typeof message>;
export type MessageResponseType = z.infer<typeof messageResponse>;
