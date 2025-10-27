import http from "@/lib/http";
import {
  ClubInvitationResponseType,
  ClubUpdateInvitationStatusType,
  CreateClubInvitationType,
} from "@/schemaValidations/club-invitation";
const clubInvitationApiRequest = {
  sendClubInvitation: (body: CreateClubInvitationType) =>
    http.post<ClubInvitationResponseType>("/club_invitation", body),
  updateInvitationStatus: (body: ClubUpdateInvitationStatusType) =>
    http.put<ClubInvitationResponseType>("/club_invitation", body),
  getMyClubInvitations: (page: number, size: number) =>
    http.get<ClubInvitationResponseType>(
      `/club-invitation/my-invitations?page=${page}&size=${size}`
    ),
};
export default clubInvitationApiRequest;
