import { z } from "zod";

export const ClubMatchStatus = z.enum([
  "NOT_STARTED",
  "IN_PROGRESS",
  "FINISHED",
  "CANCELLED",
  "SKIPPED",
]);
export type ClubMatchStatus = z.infer<typeof ClubMatchStatus>;

// Đấu thủ trong trận của CLB
export const ClubMatchParticipantSchema = z.object({
  participantId: z.string(), // ClubTournamentParticipant.id
  clubId: z.string().nullable().optional(),
  clubName: z.string(),
  clubLogoUrl: z.string().nullable().optional(),
  memberId: z.string().nullable().optional(),
  memberName: z.string().nullable().optional(),
  memberAvatarUrl: z.string().nullable().optional(),
  rosterEntryId: z.string().optional(),
});
export type ClubMatchParticipant = z.infer<typeof ClubMatchParticipantSchema>;

/** Trạng thái 1 ô đấu (legacy match hoặc rubber). */
export const ClubBracketSideStatusSchema = ClubMatchStatus.or(z.string());

// Một trận đấu trong bảng đấu CLB (legacy: 1 rubber = 1 card)
export const ClubBracketMatchSchema = z.object({
  matchId: z.string(),
  round: z.number(),
  matchIndex: z.number(),
  player1: ClubMatchParticipantSchema.nullable(),
  player2: ClubMatchParticipantSchema.nullable(),
  setScoreP1: z.array(z.number()).nullable(),
  setScoreP2: z.array(z.number()).nullable(),
  winnerId: z.string().nullable(),
  winnerName: z.string().nullable(),
  status: ClubBracketSideStatusSchema,
});
export type ClubBracketMatch = z.infer<typeof ClubBracketMatchSchema>;

export const ClubLineTypeEnumSchema = z.enum([
  "SINGLES",
  "MEN_DOUBLES",
  "WOMEN_DOUBLES",
  "MIXED_DOUBLES",
]);
export type ClubLineTypeEnum = z.infer<typeof ClubLineTypeEnumSchema>;

// Một rubber (TournamentMatch) trong tie
export const ClubBracketRubberSchema = z.object({
  matchId: z.string(),
  lineType: ClubLineTypeEnumSchema.nullish(),
  lineIndex: z.number().nullish(),
  label: z.string().nullish(),
  club1Players: z.array(ClubMatchParticipantSchema).nullish(),
  club2Players: z.array(ClubMatchParticipantSchema).nullish(),
  setScoreP1: z.array(z.number()).nullable().optional(),
  setScoreP2: z.array(z.number()).nullable().optional(),
  winnerClubParticipantId: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
});
export type ClubBracketRubber = z.infer<typeof ClubBracketRubberSchema>;

export const ClubBracketTieSchema = z.object({
  tieId: z.string().nullable().optional(),
  round: z.number(),
  matchIndex: z.number(),
  club1: ClubMatchParticipantSchema.nullable().optional(),
  club2: ClubMatchParticipantSchema.nullable().optional(),
  club1RubberWins: z.number(),
  club2RubberWins: z.number(),
  club1SetsWon: z.number(),
  club2SetsWon: z.number(),
  winnerClubParticipantId: z.string().nullable().optional(),
  status: z.string(),
  rubbers: z.array(ClubBracketRubberSchema),
});
export type ClubBracketTie = z.infer<typeof ClubBracketTieSchema>;

/** Một vòng: có thể chỉ có `matches` (legacy), chỉ có `ties` (club multi-rubber), hoặc cả hai sau migration. */
export const ClubBracketRoundSchema = z.object({
  round: z.number(),
  matches: z
    .array(ClubBracketMatchSchema)
    .nullish()
    .transform((v) => v ?? []),
  ties: z
    .array(ClubBracketTieSchema)
    .nullish()
    .transform((v) => v ?? []),
});
export type ClubBracketRound = z.infer<typeof ClubBracketRoundSchema>;

// Toàn bộ bảng đấu của một hạng mục
export const ClubBracketResponseSchema = z.object({
  tournamentId: z.string(),
  tournamentName: z.string(),
  categoryId: z.string().nullable().optional(),
  categoryName: z.string(),
  totalRounds: z.number(),
  rounds: z.array(ClubBracketRoundSchema),
});
export type ClubBracketResponse = z.infer<typeof ClubBracketResponseSchema>;

export const ClubBracketResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: ClubBracketResponseSchema,
});
export type ClubBracketResponseType = z.infer<typeof ClubBracketResponse>;

export const ClubLineupRequestSchema = z.object({
  lineup: z.record(z.string(), z.string()),
});
export type ClubLineupRequestPayload = z.infer<typeof ClubLineupRequestSchema>;

// Request body cho việc chọn đại diện (legacy singles)
export const ClubRepresentativeRequestSchema = z.object({
  rosterEntryId: z.string().min(1, "rosterEntryId is required"),
});
export type ClubRepresentativeRequest = z.infer<
  typeof ClubRepresentativeRequestSchema
>;

// Đại diện hiện tại của một participant
export const ClubRepresentativeResponseSchema = z.object({
  participantId: z.string(),
  rosterEntryId: z.string().nullable().optional(),
  memberName: z.string().nullable().optional(),
  memberAvatarUrl: z.string().nullable().optional(),
  clubName: z.string().nullable().optional(),
});
export type ClubRepresentativeResponse = z.infer<
  typeof ClubRepresentativeResponseSchema
>;

export const ClubRepresentativeResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: ClubRepresentativeResponseSchema,
});
export type ClubRepresentativeResponseType = z.infer<
  typeof ClubRepresentativeResponse
>;

// Set score cho việc cập nhật kết quả
export const SetScoreSchema = z.object({
  p1: z.number().nullable(),
  p2: z.number().nullable(),
});

export const UpdateClubMatchResultBody = z.object({
  sets: z.array(SetScoreSchema),
});
export type UpdateClubMatchResultBodyType = z.infer<
  typeof UpdateClubMatchResultBody
>;
