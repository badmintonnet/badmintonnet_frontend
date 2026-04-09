import z, { array } from "zod";

const GenderEnum = z.enum(["MALE", "FEMALE", "OTHER"]);
const StatusScheduleEnum = z.enum([
  "PENDING",
  "CONFIRMED",
  "ONGOING",
  "COMPLETED",
  "CANCELLED",
  "ABSENT",
  "REJECTED",
]);
export const OwnerClub = z.object({
  clubName: z.string(),
  slug: z.string(),
  urlLogo: z.string(),
});
export const AccountRes = z
  .object({
    data: z.object({
      id: z.string(),
      email: z.string(),
      fullName: z.string(),
      birthDate: z.string(),
      gender: GenderEnum,
      address: z.string(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
      bio: z.string().nullable(),
      avatarUrl: z.string().nullable(),
      phone: z.string().nullable(),
      enabled: z.boolean(),
      createdAt: z.coerce.date(),
      updatedAt: z.coerce.date(),
      createdBy: z.string(),
      updatedBy: z.string(),
      slug: z.string(),
      reputationScore: z.int(),
      totalParticipatedEvents: z.int(),
      profileProtected: z.boolean(),
      ownerClubs: array(OwnerClub),
      myClubs: array(OwnerClub),
    }),
    message: z.string(),
  })
  .strict();

export type AccountResType = z.TypeOf<typeof AccountRes>;

export const UpdateProfileBody = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { message: "Tên phải có ít nhất 2 ký tự" })
    .max(256, { message: "Tên không được quá 256 ký tự" }),

  birthDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Ngày sinh không hợp lệ",
  }),

  gender: GenderEnum,

  address: z.string(),

  latitude: z.number(),

  longitude: z.number(),

  phone: z
    .string()
    .regex(/^(0[35789][0-9]{8})$/, {
      message: "Số điện thoại không hợp lệ",
    })
    .optional(),

  avatarUrl: z.string().optional(),

  bio: z
    .string()
    .max(1000, { message: "Tiểu sử không được quá 1000 ký tự" })
    .optional(),
});

export type UpdateProfileBodyType = z.TypeOf<typeof UpdateProfileBody>;

export const PlayerRatingCreateBody = z
  .object({
    experience: z.number().int().min(0).max(5),
    serve: z.number().int().min(0).max(5),
    smash: z.number().int().min(0).max(5),
    clear: z.number().int().min(0).max(5),
    dropShot: z.number().int().min(0).max(5),
    drive: z.number().int().min(0).max(5),
    netShot: z.number().int().min(0).max(5),
    doubles: z.number().int().min(0).max(5),
    defense: z.number().int().min(0).max(5),
    footwork: z.number().int().min(0).max(5),
    stamina: z.number().int().min(0).max(5),
    tactics: z.number().int().min(0).max(5),
  })
  .strict();

export type PlayerRatingCreateBodyType = z.TypeOf<
  typeof PlayerRatingCreateBody
>;

export const PlayerRating = z.object({
  id: z.string(),
  experience: z.number().int(),
  serve: z.number().int(),
  smash: z.number().int(),
  clear: z.number().int(),
  dropShot: z.number(),
  drive: z.number().int(),
  netShot: z.number().int(),
  doubles: z.number().int(),
  defense: z.number().int(),
  footwork: z.number().int(),
  stamina: z.number().int(),
  tactics: z.number().int(),
  averageTechnicalScore: z.number(),
  overallScore: z.number(),
  skillLevel: z.string(),
  slug: z.string(),
  verifyCount: z.number().int(),
});

export type PlayerRatingType = z.TypeOf<typeof PlayerRating>;

export const PlayerRatingResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: PlayerRating,
});

export type PlayerRatingResponseType = z.TypeOf<typeof PlayerRatingResponse>;

export const ReputationHistory = z.object({
  id: z.string(),
  change: z.number().int(),
  reason: z.string(),
  createdAt: z.coerce.date(),
});

export type ReputationHistoryType = z.TypeOf<typeof ReputationHistory>;

export const ReputationHistoryResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(ReputationHistory),
});

export type ReputationHistoryResponseType = z.TypeOf<
  typeof ReputationHistoryResponse
>;

export const AccountAdminSchema = z.object({
  id: z.string(),
  email: z.string(),
  fullName: z.string(),
  birthDate: z.string(),
  gender: GenderEnum,
  address: z.string(),
  phone: z.string(),
  enabled: z.boolean(),
  createdAt: z.coerce.date(),
  reputationScore: z.int(),
  totalParticipatedEvents: z.int(),
  slug: z.string(),
  ownerClubs: array(OwnerClub),
  role: z.string(),
  overallScore: z.number(),
});

export const PagedAccountAdminResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: z.object({
    content: z.array(AccountAdminSchema),
    page: z.number(),
    size: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
    last: z.boolean(),
  }),
});

export type AccountAdminType = z.infer<typeof AccountAdminSchema>;
export type PagedAccountAdminResponseType = z.infer<
  typeof PagedAccountAdminResponse
>;

export const AccountScheduleSchema = z.object({
  id: z.string(),
  name: z.string(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  status: StatusScheduleEnum,
  slug: z.string(),
  createdAt: z.coerce.date(),
});

export const PagedAccountScheduleResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: z.object({
    content: z.array(AccountScheduleSchema),
    page: z.number(),
    size: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
    last: z.boolean(),
  }),
});

export type AccountScheduleType = z.infer<typeof AccountScheduleSchema>;
export type PagedAccountScheduleResponseType = z.infer<
  typeof PagedAccountScheduleResponse
>;
export const MemberScheduleResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(AccountScheduleSchema),
});
export type MemberScheduleResponse = z.infer<typeof MemberScheduleResponse>;

export const CategoryInfoSchema = z.object({
  categoryId: z.string(),
  categoryName: z.string(),
  type: z.string(),
  format: z.string(),
  minLevel: z.number().nullable(),
  maxLevel: z.number().nullable(),
});

export type CategoryInfoSchemaType = z.infer<typeof CategoryInfoSchema>;

export const TournamentInfoSchema = z.object({
  tournamentId: z.string(),
  name: z.string(),
  location: z.string(),
  logoUrl: z.string(),
  slug: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});

export type TournamentInfoSchemaType = z.infer<typeof TournamentInfoSchema>;

export const RoundHistorySchema = z.object({
  id: z.string(),
  round: z.number(),
  opponentId: z.string(),
  opponentName: z.string(),
  won: z.boolean(),

  scoreP1: z.array(z.number()),
  scoreP2: z.array(z.number()),
});

export const PlayerTournamentHistorySchema = z.object({
  historyId: z.string(),

  tournament: TournamentInfoSchema,
  category: CategoryInfoSchema,

  isDouble: z.boolean(),
  teamId: z.string(),

  finalRanking: z.number(),
  prize: z.string(),

  rounds: z.array(RoundHistorySchema),

  createdAt: z.coerce.date(),
});

export type PlayerTournamentHistorySchemaType = z.infer<
  typeof PlayerTournamentHistorySchema
>;

export const PlayerTournamentHistoryResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(PlayerTournamentHistorySchema),
});
export type PlayerTournamentHistoryResponseType = z.infer<
  typeof PlayerTournamentHistoryResponse
>;
