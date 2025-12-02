import { z } from "zod";

export const MatchStatus = z.enum([
  "NOT_STARTED",
  "IN_PROGRESS",
  "FINISHED",
  "CANCELLED",
]);

export type MatchStatus = z.infer<typeof MatchStatus>;

export const TournamentMatchSchema = z.object({
  matchId: z.string(),
  round: z.number(),
  matchIndex: z.number(),
  player1Id: z.string().nullable(),
  player2Id: z.string().nullable(),
  player1Name: z.string().nullable(),
  player2Name: z.string().nullable(),
  scoreP1: z.number().nullable(),
  scoreP2: z.number().nullable(),
  winnerId: z.string().nullable(),
  winnerName: z.string().nullable(),
  status: MatchStatus,
});

export type TournamentMatchSchemaType = z.infer<typeof TournamentMatchSchema>;

export const GenerateBracketResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(TournamentMatchSchema),
});

export type GenerateBracketResponseType = z.infer<
  typeof GenerateBracketResponse
>;

export const UpdateMatchStatusBody = z.object({
  scoreP1: z.number().nullable(),
  scoreP2: z.number().nullable(),
  winnerId: z.string().nullable(),
});

export type UpdateMatchStatusBodyType = z.infer<typeof UpdateMatchStatusBody>;

export const BracketRoundSchema = z.object({
  round: z.number(),
  matches: z.array(TournamentMatchSchema),
});

export type BracketRoundSchemaType = z.infer<typeof BracketRoundSchema>;

export const BracketTreeSchema = z.object({
  categoryId: z.string(),
  categoryName: z.string(),
  totalRounds: z.number(),
  rounds: z.array(BracketRoundSchema),
});

export type BracketTreeSchemaType = z.infer<typeof BracketTreeSchema>;

export const BracketTreeResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: BracketTreeSchema,
});

export type BracketTreeResponseType = z.infer<typeof BracketTreeResponse>;
