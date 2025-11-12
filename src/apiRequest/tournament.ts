import http from "@/lib/http";
import { FileResType } from "@/schemaValidations/common.schema";
import {
  CategoryDetailResponse,
  PagedTournamentCategoryParticipantsResponse,
  PagedTournamentResponse,
  TournamentCreateRequest,
  TournamentDetailResponse,
  TournamentParticipantEnum,
} from "@/schemaValidations/tournament.schema";
const tournamentApiRequest = {
  uploadImageTournament: (body: FormData) =>
    http.post<FileResType>("/admin/tournament/upload", body),

  createTournament: (body: TournamentCreateRequest) =>
    http.post("/admin/tournament", body),
  getAllTournaments: (page: number, size: number, accessToken?: string) => {
    const config = {
      params: { page, size },
      ...(accessToken
        ? {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        : {}),
    };

    return http.get<PagedTournamentResponse>("/tournaments", config);
  },
  getDetailBySlug: (slug: string, token = "") =>
    http.get<TournamentDetailResponse>(`/tournaments/${slug}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),

  joinSingleTournament: (categoryId: string, token: string) =>
    http.post(`/tournaments/${categoryId}/register/single`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  getCategoryDetail: (categoryId: string) =>
    http.get<CategoryDetailResponse>(`/tournaments/categories/${categoryId}`),

  getAllParticipants: (
    categoryId: string,
    status?: TournamentParticipantEnum[],
    page: number = 0,
    size: number = 10
  ) => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("size", size.toString());

    // Add status params if provided
    if (status && status.length > 0) {
      status.forEach((s) => params.append("status", s));
    }

    return http.get<PagedTournamentCategoryParticipantsResponse>(
      `/tournament-participants/${categoryId}?${params.toString()}`
    );
  },

  approveParticipant: (participantId: string) =>
    http.put(`/tournament-participants/${participantId}/approve`),
  rejectParticipant: (participantId: string) =>
    http.put(`/tournament-participants/${participantId}/reject`),
};
export default tournamentApiRequest;
