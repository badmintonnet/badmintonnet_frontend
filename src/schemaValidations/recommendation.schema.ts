import z from "zod";

const RecommendationTypeEnum = z.enum(["CLUB", "CLUB_EVENT", "TOURNAMENT"]);

const FacilitySchema = z.object({
  id: z.string(),
  name: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  district: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  image: z.string().nullable().optional(),
});

export const RecommendationItemSchema = z.object({
  id: z.string(),
  slug: z.string().nullable().optional(),
  type: RecommendationTypeEnum,
  title: z.string(),
  subtitle: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  detailUrl: z.string(),
  clubName: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  facility: FacilitySchema.nullable().optional(),
  score: z.number(),
  distanceKm: z.number().nullable().optional(),
  minLevel: z.number().nullable().optional(),
  maxLevel: z.number().nullable().optional(),
  totalSlots: z.number().nullable().optional(),
  joinedSlots: z.number().nullable().optional(),
  fee: z.number().nullable().optional(),
  startTime: z.coerce.date().nullable().optional(),
  endTime: z.coerce.date().nullable().optional(),
  registrationEndDate: z.coerce.date().nullable().optional(),
  tags: z.array(z.string()).nullable().optional(),
  categories: z.array(z.string()).nullable().optional(),
  reasons: z.array(z.string()).default([]),
});

export const RecommendationProfileSchema = z.object({
  fullName: z.string().nullable().optional(),
  skillScore: z.number().nullable().optional(),
  skillLevel: z.string().nullable().optional(),
  hasLocation: z.boolean(),
  favoriteCategories: z.array(z.string()).default([]),
  preferredTimeSlots: z.array(z.string()).default([]),
});

export const PersonalizedRecommendationSchema = z.object({
  profile: RecommendationProfileSchema,
  clubs: z.array(RecommendationItemSchema),
  events: z.array(RecommendationItemSchema),
  tournaments: z.array(RecommendationItemSchema),
  generatedAt: z.coerce.date(),
});

export const PersonalizedRecommendationResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: PersonalizedRecommendationSchema,
});

export type RecommendationItemType = z.infer<typeof RecommendationItemSchema>;
export type PersonalizedRecommendationType = z.infer<
  typeof PersonalizedRecommendationSchema
>;
export type PersonalizedRecommendationResponseType = z.infer<
  typeof PersonalizedRecommendationResponse
>;
