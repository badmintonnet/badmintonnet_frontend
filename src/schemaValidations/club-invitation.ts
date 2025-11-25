import z, { array } from "zod";
export const InvitationStatusEnum = z.enum([
  "PENDING",
  "ACCEPTED",
  "REJECTED",
  "CANCELLED",
]);
export const createClubInvitation = z.object({
  receiverId: z.string(),
  clubId: z.string(),
  message: z.string().optional(),
});

export type CreateClubInvitationType = z.infer<typeof createClubInvitation>;

export const clubUpdateInvitationStatus = z.object({
  id: z.string(),
  status: InvitationStatusEnum,
});

export type ClubUpdateInvitationStatusType = z.infer<
  typeof clubUpdateInvitationStatus
>;

export const ClubInvitationSchema = z.object({
  id: z.string(),
  clubIdL: z.string(),
  clubName: z.string(),
  receiverId: z.string(),
  receiverName: z.string(),
  message: z.string(),
  status: InvitationStatusEnum,
  sentAt: z.coerce.date(),
  responseAt: z.coerce.date(),
});
export type ClubInvitationType = z.infer<typeof ClubInvitationSchema>;
export const ClubInvitationResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(ClubInvitationSchema),
});
export type ClubInvitationResponseType = z.infer<typeof ClubInvitationResponse>;
