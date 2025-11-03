import z from "zod";

export const ClubMemberNote = z.object({
  id: z.string(),
  comment: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullable(),
  createdBy: z.string(),
  updatedBy: z.string().nullable(),
});

export type ClubMemberNoteType = z.infer<typeof ClubMemberNote>;

export const CreateClubMemberNoteBody = z.object({
  clubId: z.string(),
  accountId: z.string(),
  comment: z.string(),
});
export type CreateClubMemberNoteBodyType = z.infer<
  typeof CreateClubMemberNoteBody
>;

export const ClubMemberNoteListRes = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(ClubMemberNote),
});

export type ClubMemberNoteListResType = z.infer<typeof ClubMemberNoteListRes>;
