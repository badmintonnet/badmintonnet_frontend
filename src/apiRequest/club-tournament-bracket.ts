import http from "@/lib/http";
import {
  ClubBracketResponseType,
  ClubRepresentativeRequest,
  ClubRepresentativeResponseType,
  UpdateClubMatchResultBodyType,
} from "@/schemaValidations/club-match.schema";

const clubTournamentBracketApiRequest = {
  // 1. Lấy bảng đấu CLB theo tournamentId (tự động tìm/tạo category MEN_SINGLE)
  getClubBracket: (tournamentId: string) =>
    http.get<ClubBracketResponseType>(
      `/club-tournament/tournament/${tournamentId}/bracket`,
    ),

  // 2. Chọn đại diện cho participant (Owner CLB)
  setRepresentative: (participantId: string, body: ClubRepresentativeRequest) =>
    http.put<ClubRepresentativeResponseType>(
      `/club-tournament/participants/${participantId}/set-representative`,
      body,
    ),

  // 3. Xem đại diện hiện tại của participant
  getRepresentative: (participantId: string) =>
    http.get<ClubRepresentativeResponseType>(
      `/club-tournament/participants/${participantId}/representative`,
    ),

  // 4. Admin: Tạo bảng đấu cho tournament
  generateBracket: (tournamentId: string) =>
    http.post(
      `/admin/club-tournament/tournaments/${tournamentId}/generate-bracket`,
    ),

  // 5. Admin: Cập nhật tỉ số trận đấu
  updateMatchResult: (matchId: string, body: UpdateClubMatchResultBodyType) =>
    http.put(`/bracket/match/${matchId}/update-result`, body),
};

export default clubTournamentBracketApiRequest;
