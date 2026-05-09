import z from "zod";

export const RankingScope = z.enum(["GLOBAL", "AREA", "CLUB"]);

export const PlayerRanking = z.object({
  rank: z.number().int(),
  accountId: z.string(),
  slug: z.string().nullable().optional(),
  fullName: z.string(),
  avatarUrl: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  competitiveScore: z.number(),
  tournamentScore: z.number(),
  winRateScore: z.number(),
  matchVolumeScore: z.number(),
  reputationScore: z.number().int(),
  totalMatches: z.number().int(),
  totalWins: z.number().int(),
  winRate: z.number(),
  completedTournaments: z.number().int(),
  provisional: z.boolean(),
});

export const RankingPage = z.object({
  content: z.array(PlayerRanking),
  page: z.number(),
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
  last: z.boolean(),
});

export const RankingResponse = z.object({
  status: z.union([z.string(), z.number()]),
  message: z.string(),
  data: RankingPage,
});

export type RankingScopeType = z.TypeOf<typeof RankingScope>;
export type PlayerRankingType = z.TypeOf<typeof PlayerRanking>;
export type RankingPageType = z.TypeOf<typeof RankingPage>;
export type RankingResponseType = z.TypeOf<typeof RankingResponse>;
