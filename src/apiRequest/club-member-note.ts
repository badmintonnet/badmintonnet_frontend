import http from "@/lib/http";
import {
  ClubMemberNoteListResType,
  ClubMemberNoteType,
  CreateClubMemberNoteBodyType,
} from "@/schemaValidations/club-member-note.schema";

const clubMemberNoteApi = {
  getAllNotes: (clubId: string, accountId: string) =>
    http.get<ClubMemberNoteListResType>(
      `/club-member-notes/${clubId}/${accountId}`
    ),

  createNote: (body: CreateClubMemberNoteBodyType) =>
    http.post<ClubMemberNoteType>(`/club-member-notes`, body),
};

export default clubMemberNoteApi;
