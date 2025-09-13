import z from "zod";

export const RatingBody = z.object({
  comment: z.string().trim(),

  rating: z
    .number()
    .min(0, { message: "Rating phải >= 0" })
    .max(5, { message: "Rating phải <= 5" }),

  eventClubId: z.string(),
});

export const ReplyBody = z.object({
  ratingId: z.string(),
  replyComment: z.string().trim(),
});

export type RatingBodyType = z.TypeOf<typeof RatingBody>;
export type ReplyBodyType = z.TypeOf<typeof ReplyBody>;
export const RatingSchema = z.object({
  id: z.string(),
  comment: z.string(),
  rating: z.number(),
  eventName: z.string(),
  nameSender: z.string(),
  createdAt: z.coerce.date(),
  avatarUrl: z.string(),
  replyComment: z.string(),
  replyCreatedAt: z.coerce.date(),
});

export type RatingType = z.infer<typeof RatingSchema>;
export const RatingResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(RatingSchema),
});

export type RatingResponseType = z.infer<typeof RatingResponse>;

export const RatingDetailResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: RatingSchema,
});

export type RatingDetailResponseType = z.infer<typeof RatingDetailResponse>;

export const RatingSummarySchema = z.object({
  totalReviews: z.number(),
  averageRating: z.number(),
  oneStar: z.number(),
  twoStars: z.number(),
  threeStars: z.number(),
  fourStars: z.number(),
  fiveStars: z.number(),
  clubEventRatingResponses: z.array(RatingSchema),
});

export type RatingSummaryType = z.infer<typeof RatingSummarySchema>;

export const RatingSummaryResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: RatingSummarySchema,
});
export type RatingSummaryResponseType = z.infer<typeof RatingSummaryResponse>;

export const RatingPageResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: z.object({
    content: z.array(RatingSchema),
    page: z.number(),
    size: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
    last: z.boolean(),
  }),
});

export type RatingPageResponseType = z.infer<typeof RatingPageResponse>;
