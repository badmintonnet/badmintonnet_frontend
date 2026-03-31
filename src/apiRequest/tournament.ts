import http from "@/lib/http";
import { FileResType } from "@/schemaValidations/common.schema";
import { FriendListResponseType } from "@/schemaValidations/friend.schema";
import {
  CategoryResultsResponseType,
  CategoryResultType,
  TournamentResultResponseType,
} from "@/schemaValidations/tournament-result";
import {
  CategoryDetailResponse,
  PagedTournamentCategoryParticipantsResponse,
  PagedTournamentCategoryTeamParticipantsResponse,
  PagedTournamentResponse,
  TournamentCreateRequest,
  TournamentDetailResponse,
  TournamentParticipantEnum,
  TournamentPartnerInvitationRequestType,
  TournamentPartnerInvitationUpdateType,
} from "@/schemaValidations/tournament.schema";
const tournamentApiRequest = {
  uploadImageTournament: (body: FormData) =>
    http.post<FileResType>("/admin/tournament/upload", body),

  createTournament: (body: TournamentCreateRequest) =>
    http.post("/admin/tournament", body),
  getAllTournaments: (
    page: number,
    size: number,
    accessToken?: string,
    participationType?: "INDIVIDUAL" | "CLUB"
  ) => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("size", size.toString());
    if (participationType) {
      params.append("participationType", participationType);
    }
    const headers: Record<string, string> = {};
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return http.get<PagedTournamentResponse>(`/tournaments?${params.toString()}`, {
      headers,
    });
  },
  getDetailBySlug: (slug: string, token = "") =>
    http.get<TournamentDetailResponse>(`/tournaments/${slug}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),

  joinSingleTournament: (categoryId: string, token: string) =>
    http.post(`/tournaments/${categoryId}/register/single`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  joinDoubleTournament: (categoryId: string) =>
    http.post(`/tournaments/${categoryId}/register/double`),

  getCategoryDetail: (categoryId: string, token = "") =>
    http.get<CategoryDetailResponse>(`/tournaments/categories/${categoryId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: "no-store",
    }),

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
  getAllTeamParticipants: (
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

    return http.get<PagedTournamentCategoryTeamParticipantsResponse>(
      `/tournament-participants/${categoryId}/double?${params.toString()}`
    );
  },
  approveParticipant: (participantId: string) =>
    http.put(`/tournament-participants/${participantId}/approve`),
  approveTeamParticipant: (teamId: string) =>
    http.put(`/tournament-participants/double/${teamId}/approve`),
  rejectParticipant: (participantId: string) =>
    http.put(`/tournament-participants/${participantId}/reject`),
  rejectTeamParticipant: (teamId: string) =>
    http.put(`/tournament-participants/double/${teamId}/reject`),
  getPartnerList: (categoryId: string) =>
    http.get<FriendListResponseType>(
      "/tournaments/get-all-partner/" + categoryId
    ),
  invitePartner: (body: TournamentPartnerInvitationRequestType) =>
    http.post("/tournament-participants/invite-partner", body),
  updateInvitationStatus: (body: TournamentPartnerInvitationUpdateType) =>
    http.put("/tournament-participants/partner/update-status", body),

  getTournamentResults: (tournamentId: string, accessToken?: string) =>
    http.get<TournamentResultResponseType>(
      `/tournament-result/${tournamentId}/results`,
      {
        ...(accessToken
          ? {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          : {}),
        cache: "no-store",
      }
    ),

  getCategoryResults: (categoryId: string, accessToken?: string) =>
    http.get<CategoryResultsResponseType>(
      `/tournament-result/category/${categoryId}`,
      {
        ...(accessToken
          ? {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          : {}),
        cache: "no-store",
      }
    ),
};
export default tournamentApiRequest;
