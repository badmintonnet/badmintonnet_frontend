import http from "@/lib/http";
import { PagedAccountAdminResponseType } from "@/schemaValidations/account.schema";

import { ClubAdminPageResType } from "@/schemaValidations/clubs.schema";
import { PagedEventAdminResponseType } from "@/schemaValidations/event.schema";
import { PagedTournamentAdminResponse } from "@/schemaValidations/tournament.schema";

const adminApiRequest = {
  getAllClubs: (page = 0, size = 10, token = "") =>
    http.get<ClubAdminPageResType>(
      `/admin/clubs/all?page=${page}&size=${size}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    ),

  updateClubStatus: (clubId: string, status: string, token = "") =>
    http.put(`/admin/clubs/${clubId}/status?newStatus=${status}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),

  deleteClub: (clubId: string, token = "") =>
    http.delete(`/admin/clubs/${clubId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),
  getAllEvents: (page = 0, size = 10, token = "") =>
    http.get<PagedEventAdminResponseType>(
      `/admin/events/all?page=${page}&size=${size}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    ),
  getAllTournament: (page = 0, size = 10, token = "") =>
    http.get<PagedTournamentAdminResponse>(
      `/admin/tournament/all?page=${page}&size=${size}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    ),
  getAllUsers: (page = 0, size = 10, token = "") =>
    http.get<PagedAccountAdminResponseType>(
      `/admin/users/all?page=${page}&size=${size}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    ),
  banUser: (userId: string, token = "") =>
    http.put(
      `/admin/users/${userId}/ban`,
      {},
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    ),
};

export default adminApiRequest;
