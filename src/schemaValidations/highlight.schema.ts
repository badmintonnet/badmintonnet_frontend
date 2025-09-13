import { z } from 'zod';

export const HighlightSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  userId: z.string(),
  userName: z.string(),
  userAvatar: z.string().optional(),
  content: z.string(),
  mediaUrls: z.array(z.string()).optional(),
  mediaType: z.enum(['IMAGE', 'VIDEO']).optional(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()).optional(),
  likes: z.number().default(0),
  comments: z.number().default(0),
});

export const CreateHighlightSchema = z.object({
  eventId: z.string(),
  content: z.string().min(1, 'Nội dung không được để trống'),
  mediaUrls: z.array(z.string()).optional(),
  mediaType: z.enum(['IMAGE', 'VIDEO']).optional(),
});

export const UpdateHighlightSchema = z.object({
  id: z.string(),
  content: z.string().min(1, 'Nội dung không được để trống').optional(),
  mediaUrls: z.array(z.string()).optional(),
  mediaType: z.enum(['IMAGE', 'VIDEO']).optional(),
});

export type HighlightType = z.infer<typeof HighlightSchema>;
export type CreateHighlightType = z.infer<typeof CreateHighlightSchema>;
export type UpdateHighlightType = z.infer<typeof UpdateHighlightSchema>;