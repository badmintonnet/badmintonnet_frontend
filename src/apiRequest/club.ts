import http from "@/lib/http";
import {
  ClubPageResType,
  ClubResType,
  CreateClubBodyType,
} from "@/schemaValidations/clubs.schema";

import { FileResType } from "@/schemaValidations/common.schema";

const clubServiceApi = {
  uploadImage: (body: FormData) =>
    http.post<FileResType>("/clubs/upload", body),

  createClub: (body: CreateClubBodyType) => http.post("/clubs", body),
  getAllPublicClubs: (page = 0, size = 10, token = "") =>
    http.get<ClubPageResType>(`/clubs/all_public?page=${page}&size=${size}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),
  getMyClubs: (page = 0, size = 10, token = "") =>
    http.get<ClubPageResType>(`/clubs/my_clubs/all?page=${page}&size=${size}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),
  getClubById: (id: string) => http.get<ClubResType>(`/clubs/${id}`),
};
export default clubServiceApi;
