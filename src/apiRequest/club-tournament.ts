import http from "@/lib/http";
import {
  ClubTournamentParticipantResponseType,
  ClubTournamentRegisterRequestType,
  ClubTournamentStatus,
  ClubTournamentUpdateRosterRequestType,
  PagedClubTournamentParticipantsResponseType,
  ClubTournamentMyListResponseType,
} from "@/schemaValidations/tournament.schema";

const clubTournamentApiRequest = {
  // 1.1 Đăng ký CLB tham gia tournament
  registerClub: (
    tournamentId: string,
    body: ClubTournamentRegisterRequestType,
  ) =>
    http.post<ClubTournamentParticipantResponseType>(
      `/club-tournament/${tournamentId}/register`,
      body,
    ),

  // 1.2 Cập nhật roster
  updateRoster: (
    participantId: string,
    body: ClubTournamentUpdateRosterRequestType,
  ) =>
    http.put<ClubTournamentParticipantResponseType>(
      `/club-tournament/participant/${participantId}/roster`,
      body,
    ),

  // 1.3 Hủy đăng ký
  cancelRegistration: (participantId: string) =>
    http.delete(`/club-tournament/participant/${participantId}`),

  // 1.4 Danh sách CLB đã đăng ký trong tournament
  getParticipantsByTournament: (
    tournamentId: string,
    status?: ClubTournamentStatus[],
    page = 0,
    size = 10,
  ) => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("size", size.toString());
    if (status && status.length > 0) {
      status.forEach((s) => params.append("status", s));
    }
    return http.get<PagedClubTournamentParticipantsResponseType>(
      `/club-tournament/${tournamentId}/participants?${params.toString()}`,
    );
  },

  // Alias for backward compatibility
  getParticipantsByCategory: (
    tournamentId: string,
    status?: ClubTournamentStatus[],
    page = 0,
    size = 10,
  ) =>
    clubTournamentApiRequest.getParticipantsByTournament(
      tournamentId,
      status,
      page,
      size,
    ),

  // 1.5 Chi tiết đăng ký của một CLB (full roster)
  getParticipantDetail: (participantId: string, token = "") =>
    http.get<ClubTournamentParticipantResponseType>(
      `/club-tournament/participant/${participantId}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    ),

  // 1.6 Kiểm tra CLB của tôi đã đăng ký chưa
  getMyParticipation: (tournamentId: string, clubId: string) =>
    http.get<{ status: number; message: string; data: unknown }>(
      `/club-tournament/${tournamentId}/my-participation?clubId=${clubId}`,
    ),

  // 1.7 Admin duyệt CLB
  approveParticipant: (participantId: string) =>
    http.put(`/club-tournament/participant/${participantId}/approve`),

  // 1.8 Admin từ chối CLB
  rejectParticipant: (participantId: string) =>
    http.put(`/club-tournament/participant/${participantId}/reject`),

  // 1.9 Lấy danh sách tournament mà CLB đã đăng ký
  getMyTournaments: (clubId: string, token = "") =>
    http.get<ClubTournamentMyListResponseType>(
      `/club-tournament/my-tournaments?clubId=${clubId}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    ),
};

export default clubTournamentApiRequest;
