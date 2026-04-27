import z, { string } from "zod";

export const MessageRes = z
  .object({
    message: z.string(),
  })
  .strict();

export type MessageResType = z.TypeOf<typeof MessageRes>;

export const FileRes = z.object({
  status: z.string(),
  message: z.string(),
  data: z.object({
    fileName: z.string(),
  }),
});

export type FileResType = z.TypeOf<typeof FileRes>;

export const ListStringRes = z.object({
  status: z.string(),
  message: z.string(),
  data: z.array(string()),
});

export type ListStringResType = z.TypeOf<typeof ListStringRes>;

export const NotificationMessage = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  link: z.string(),
  read: z.boolean(),
});
export const NotificationMessageRes = z.object({
  status: z.string(),
  message: z.string(),
  data: z.array(NotificationMessage),
});
export type NotificationMessageType = z.TypeOf<typeof NotificationMessage>;
export type NotificationMessageResType = z.TypeOf<
  typeof NotificationMessageRes
>;
export const NotificationMessagePage = z.object({
  status: z.number(),
  message: z.string(),
  data: z.object({
    content: z.array(NotificationMessage),
    page: z.number(),
    size: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
    last: z.boolean(),
  }),
});

export type NotificationMessagePageType = z.TypeOf<
  typeof NotificationMessagePage
>;
