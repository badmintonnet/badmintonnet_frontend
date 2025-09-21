import { z } from "zod";

export const MediaTypeEnum = z.enum(["IMAGE", "VIDEO"]);

export const MediaSchema = z.object({
  fileName: z.string(),
  url: z.string(),
  type: MediaTypeEnum,
});

export const HighlightSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  authorName: z.string(),
  authorAvatar: z.string().optional(),
  content: z.string(),
  mediaList: z.array(MediaSchema).optional(),
  createdAt: z.string().or(z.date()),
  likeCount: z.number().default(0),
  commentCount: z.number().default(0),
  userId: z.string(),
  currentUserId: z.string().optional(), // ID người dùng hiện tại, có thể null nếu chưa đăng nhập
});

export const CreateHighlightSchema = z.object({
  eventId: z.string(),
  content: z.string().min(1, "Nội dung không được để trống"),
  fileNames: z.array(z.string()).optional(),
});

export const HighlightResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(HighlightSchema),
});

export const FileRes = z.object({
  status: z.string(),
  message: z.string(),
  data: z.union([
    z.object({
      fileName: z.string(),
    }),
    z.object({
      fileNames: z.array(z.string()),
    }),
  ]),
});

export const UpdateHighlightSchema = z.object({
  id: z.string(),
  content: z.string().min(1, "Nội dung không được để trống"),
  keepFileNames: z.array(z.string()).optional(),
  newFileNames: z.array(z.string()).optional(),
});

export type MediaSchemaType = z.infer<typeof MediaSchema>;
export type UpdateHighlightType = z.infer<typeof UpdateHighlightSchema>;
export type FileResType = z.TypeOf<typeof FileRes>;
export type HighlightResponseType = z.infer<typeof HighlightResponse>;
export type HighlightType = z.infer<typeof HighlightSchema>;
export type CreateHighlightType = z.infer<typeof CreateHighlightSchema>;
