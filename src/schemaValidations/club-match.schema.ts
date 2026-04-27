import { z } from "zod";

export const ClubMatchStatus = z.enum([
  "NOT_STARTED",
  "IN_PROGRESS",
  "FINISHED",
  "CANCELLED",
]);
export type ClubMatchStatus = z.infer<typeof ClubMatchStatus>;

// Đấu thủ trong trận của CLB
export const ClubMatchParticipantSchema = z.object({
  participantId: z.string(), // ClubTournamentParticipant.id
  clubId: z.string(),
  clubName: z.string(), // e.g. "CLB Bình Dương"
  clubLogoUrl: z.string().nullable().optional(),
  memberId: z.string(), // Account.id
  memberName: z.string(), // e.g. "Nguyễn Văn A"
  memberAvatarUrl: z.string().nullable().optional(),
  rosterEntryId: z.string(),
});
export type ClubMatchParticipant = z.infer<typeof ClubMatchParticipantSchema>;

// Một trận đấu trong bảng đấu CLB
export const ClubBracketMatchSchema = z.object({
  matchId: z.string(),
  round: z.number(),
  matchIndex: z.number(),
  player1: ClubMatchParticipantSchema.nullable(), // null = BYE
  player2: ClubMatchParticipantSchema.nullable(),
  setScoreP1: z.array(z.number()).nullable(),
  setScoreP2: z.array(z.number()).nullable(),
  winnerId: z.string().nullable(),
  winnerName: z.string().nullable(),
  status: ClubMatchStatus,
});
export type ClubBracketMatch = z.infer<typeof ClubBracketMatchSchema>;

// Một vòng trong bảng đấu
export const ClubBracketRoundSchema = z.object({
  round: z.number(),
  matches: z.array(ClubBracketMatchSchema),
});
export type ClubBracketRound = z.infer<typeof ClubBracketRoundSchema>;

// Toàn bộ bảng đấu của một hạng mục
export const ClubBracketResponseSchema = z.object({
  tournamentId: z.string(),
  tournamentName: z.string(),
  categoryId: z.string(),
  categoryName: z.string(), // "Đơn nam"
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

// Request body cho việc chọn đại diện
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
