import http from "@/lib/http";
import {
  ClubPageResType,
  ClubResType,
  CreateClubBodyType,
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
  getAllPublicClubs: (page = 0, size = 10, token = "") =>
    http.get<ClubPageResType>(`/clubs/all_public?page=${page}&size=${size}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),
  getMyClubs: (page = 0, size = 10, token = "") =>
    http.get<MyClubPageResType>(
      `/clubs/my_clubs/all?page=${page}&size=${size}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    ),
  getClubById: (id: string) => http.get<ClubResType>(`/clubs/${id}`),
  getMyClubById: (id: string, token = "") =>
    http.get<MyClubResType>(`/clubs/my_clubs/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),
  joinClub: (id: string, token = "") =>
    http.post(`/clubs/${id}/join`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),

  getClubMembers: (
    id: string,
    page = 0,
    size = 10,
    token = "",
    status = "PENDING"
  ) =>
    http.get<MemberPageResType>(
      `/clubs/my_clubs/${id}/member?page=${page}&size=${size}&status=${status}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    ),

  postApproveMember: (
    clubId: string,
    memberId: string,
    approve = true,
    token = ""
  ) =>
    http.post(
      `/clubs/my_clubs/${clubId}/member/${memberId}/approve?approve=${approve}`,
      null,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    ),
};
export default clubServiceApi;
