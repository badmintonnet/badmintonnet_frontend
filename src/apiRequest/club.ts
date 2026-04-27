import http from "@/lib/http";
import { MemberScheduleResponse } from "@/schemaValidations/account.schema";
import {
  ClubMemberDetailResType,
  ClubPageResType,
  ClubResType,
  ClubWarningResponseType,
  ClubWarningType,
  CreateClubBodyType,
  GuestResponseType,
  MemberPageResType,
  MyClubPageResType,
  MyClubResType,
} from "@/schemaValidations/clubs.schema";

import { FileResType } from "@/schemaValidations/common.schema";

const clubServiceApi = {
  uploadImage: (body: FormData) =>
    http.post<FileResType>("/clubs/upload", body),

  createClub: (body: CreateClubBodyType) =>
    http.post<ClubResType>("/clubs", body),
  updateClub: (id: string, body: CreateClubBodyType, token = "") =>
    http.put<ClubResType>(`/clubs/${id}`, body, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),

  getAllPublicClubs: ({
    page = 0,
    size = 10,
    search = "",
    province = "",
    ward = "",
    selectedLevels = [],
    reputationSort = "",
    facilityNames = [],
    token = "",
  }: {
    page?: number;
    size?: number;
    search?: string;
    province?: string;
    ward?: string;
    selectedLevels?: string[];
    reputationSort?: string;
    facilityNames?: string[];
    token?: string;
  }) => {
    const params = new URLSearchParams();

    params.append("page", page.toString());
    params.append("size", size.toString());

    if (search) params.append("search", search);
    if (province) params.append("province", province);
    if (ward) params.append("ward", ward);
    if (reputationSort) params.append("reputationSort", reputationSort);

    selectedLevels.forEach((level) => params.append("selectedLevels", level));
    facilityNames.forEach((name) => params.append("facilityNames", name));

    return http.get<ClubPageResType>(`/clubs/all_public?${params.toString()}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  getSuggestedClubs: (token = "") =>
    http.get<ClubPageResType>("/clubs/all_public", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),

  getMyClubs: (page = 0, size = 10, token = "") =>
    http.get<MyClubPageResType>(
      `/clubs/my_clubs/all?page=${page}&size=${size}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    ),
  getClubById: (slug: string, token = "") =>
    http.get<ClubResType>(`/clubs/${slug}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),
  getMyClubById: (slug: string, token = "") =>
    http.get<MyClubResType>(`/clubs/my_clubs/${slug}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),
  joinClub: (id: string, description: string) =>
    http.post(`/clubs/${id}/join`, { notification: description }),

  getClubMembers: (
    id: string,
    page = 0,
    size = 10,
    token = "",
    status = "PENDING",
  ) =>
    http.get<MemberPageResType>(
      `/clubs/my_clubs/${id}/member?page=${page}&size=${size}&status=${status}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        cache: "no-store",
      },
    ),
  getGuests: (id: string, token = "") =>
    http.get<GuestResponseType>(`/clubs/my_clubs/${id}/guest`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: "no-store",
    }),
  postApproveMember: (
    clubId: string,
    memberId: string,
    approve = true,
    reason = "",
    token = "",
  ) =>
    http.post(
      `/clubs/my_clubs/${clubId}/member/${memberId}/approve?approve=${approve}&reason=${encodeURIComponent(
        reason,
      )}`,
      null,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    ),

  getClubMemberDetail: (clubId: string, id: string) =>
    http.get<ClubMemberDetailResType>(
      `/clubs/my_clubs/${clubId}/detail_member/${id}`,
    ),

  getClubMemberSchedule: (id: string, memberId: string, token = "") =>
    http.get<MemberScheduleResponse>(
      `/clubs/my_clubs/${id}/member/${memberId}/schedule`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        cache: "no-store",
      },
    ),
  outClubMember: (clubId: string) =>
    http.delete(`/clubs/my_clubs/${clubId}/out`),
  createClubWarning: (body: ClubWarningType) =>
    http.post(`/club_warning`, body),

  getClubWarning: (clubId: string, accountId: string) =>
    http.get<ClubWarningResponseType>(`/club_warning/${clubId}/${accountId}`),
  revokeWarning: (id: string) => http.put(`/club_warning/${id}`),
  verifyMemberRating: (clubId: string, memberId: string) =>
    http.put(`/clubs/my_clubs/${clubId}/members/${memberId}/verify`, {}),
};
export default clubServiceApi;
