import z from "zod";

export const CategoryResultItem = z.object({
  ranking: z.number(),
  prize: z.string(),

  participantId: z.string(),
  participantName: z.string(),

  teamId: z.string().nullable(),
  teamName: z.string().nullable(),
});

export type CategoryResultItemType = z.infer<typeof CategoryResultItem>;

export const CategoryResult = z.object({
  categoryId: z.string(),
  categoryName: z.string(),

  results: z.array(CategoryResultItem),
});

export type CategoryResultType = z.infer<typeof CategoryResult>;

export const TournamentResultSchema = z.object({
  tournamentId: z.string(),
  tournamentName: z.string(),
  categories: z.array(CategoryResult),
});

export type TournamentResultType = z.infer<typeof TournamentResultSchema>;

export const TournamentResultResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: TournamentResultSchema,
});

export type TournamentResultResponseType = z.infer<
  typeof TournamentResultResponse
>;

export const CategoryResultsResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: CategoryResult,
});

export type CategoryResultsResponseType = z.infer<
  typeof CategoryResultsResponse
>;
