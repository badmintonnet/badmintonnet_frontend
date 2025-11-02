import z from "zod";

// Dữ liệu chi tiết một yêu cầu hủy
export const ClubEventCancellation = z.object({
  cancellationId: z.string(),
  participantId: z.string(),
  accountSlug: z.string(),
  avatarUrl: z.string(),
  fullName: z.string(),
  email: z.string(),
  reason: z.string(),
  approved: z.boolean().nullable(), // null = chờ duyệt
  cancelDate: z.coerce.date(),
  lateCancellation: z.boolean(),
  reviewedAt: z.coerce.date().nullable(),
  reviewedBy: z.string().nullable(),
});

// Kiểu dữ liệu (TypeScript type)
export type ClubEventCancellationType = z.infer<typeof ClubEventCancellation>;

// Response khi gọi API lấy danh sách người hủy
export const ClubEventCancellationListRes = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(ClubEventCancellation),
});

export type ClubEventCancellationListResType = z.infer<
  typeof ClubEventCancellationListRes
>;
