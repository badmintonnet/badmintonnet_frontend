import { z } from "zod";

/** Khớp TeamMatchFormatDTO (backend). */
export const TeamMatchFormatDtoSchema = z.object({
  singles: z.number().nullish(),
  menDoubles: z.number().nullish(),
  womenDoubles: z.number().nullish(),
  mixedDoubles: z.number().nullish(),
});
export type TeamMatchFormatDto = z.infer<typeof TeamMatchFormatDtoSchema>;

export const ClubLineupSlotSchema = z.object({
  position: z.string(),
  lineType: z.string(),
  lineIndex: z.number().nullable().optional(),
  playerSlot: z.number().nullable().optional(),
  rosterEntryId: z.string().nullable().optional(),
  accountId: z.string().nullable().optional(),
  fullName: z.string().nullable().optional(),
  avatarUrl: z.string().nullable().optional(),
});
export type ClubLineupSlot = z.infer<typeof ClubLineupSlotSchema>;

export const ClubLineupDataSchema = z.object({
  participantId: z.string(),
  clubId: z.string(),
  clubName: z.string(),
  format: TeamMatchFormatDtoSchema.nullish(),
  slots: z.array(ClubLineupSlotSchema),
  filledCount: z.number(),
  totalSlots: z.number(),
  complete: z.boolean(),
  locked: z.boolean(),
});
export type ClubLineupDataType = z.infer<typeof ClubLineupDataSchema>;

export const ClubLineupResponseEnvelopeSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: ClubLineupDataSchema,
});
