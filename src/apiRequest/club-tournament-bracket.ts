import http from "@/lib/http";
import {
  ClubBracketResponseType,
  ClubRepresentativeRequest,
  ClubRepresentativeResponseType,
  UpdateClubMatchResultBodyType,
  ClubLineupRequestPayload,
} from "@/schemaValidations/club-match.schema";
import { ClubTournamentResultResponseType } from "@/schemaValidations/club-tournament-result.schema";
import type { ClubLineupDataType } from "@/schemaValidations/club-lineup.schema";

const clubTournamentBracketApiRequest = {
  // 1. Lấy bảng đấu CLB theo tournamentId (tự động tìm/tạo category MEN_SINGLE)
  getClubBracket: (tournamentId: string) =>
    http.get<ClubBracketResponseType>(
      `/club-tournament/tournament/${tournamentId}/bracket`,
    ),

  // 1b. Lấy kết quả CLUB tournament (podium, ranking, stats, key matches)
  getClubResults: (tournamentId: string, accessToken?: string) =>
    http.get<ClubTournamentResultResponseType>(
      `/club-tournament/tournament/${tournamentId}/results`,
      {
        ...(accessToken
          ? { headers: { Authorization: `Bearer ${accessToken}` } }
          : {}),
        cache: "no-store",
      },
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

  getLineup: (participantId: string) =>
    http.get<{
      status: number;
      message: string;
      data: ClubLineupDataType;
    }>(`/club-tournament/participants/${participantId}/lineup`),

  setLineup: (participantId: string, body: ClubLineupRequestPayload) =>
    http.put<{
      status: number;
      message: string;
      data: ClubLineupDataType;
    }>(`/club-tournament/participants/${participantId}/lineup`, body),

  // 4. Admin: Tạo bảng đấu cho tournament
  generateBracket: (tournamentId: string) =>
    http.post(
      `/admin/club-tournament/tournaments/${tournamentId}/generate-bracket`,
    ),

  // 5. Admin: Cập nhật tỉ số trận đấu
  updateMatchResult: (matchId: string, body: UpdateClubMatchResultBodyType) =>
    http.post(`/bracket/match/${matchId}/update-result`, body),
};

export default clubTournamentBracketApiRequest;
