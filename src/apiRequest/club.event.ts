import http from "@/lib/http";

import { FileResType } from "@/schemaValidations/common.schema";
import {
  CreateEventClubBodyType,
  EventDetailResponseType,
  PagedEventResponseType,
  PagedParticipantResponseType,
} from "@/schemaValidations/event.schema";

const eventClubApiRequest = {
  uploadImageClubEvent: (body: FormData) =>
    http.post<FileResType>("/club-event/upload", body),

  createEventClub: (body: CreateEventClubBodyType) =>
    http.post<EventDetailResponseType>("/club-event", body),

  // Lấy danh sách event clubs theo club ID
  getEventClubsByClubId: (
    clubId: string,
    page: number,
    size: number,
    accessToken: string
  ) =>
    http.get<PagedEventResponseType>(
      `/club-event/all/${clubId}?page=${page}&size=${size}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ),
  //Lấy danh sách event clubs tất cả
  getAllPublicEventClubs: (page: number, size: number) =>
    http.get<PagedEventResponseType>(
      `/club-event/all/public?page=${page}&size=${size}`
    ),
  getMyClubsEventClubs: (page: number, size: number, accessToken: string) =>
    http.get<PagedEventResponseType>(
      `/club-event/all/my_clubs?page=${page}&size=${size}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ),
  getEventById: (id: string, accessToken: string) =>
    http.get<EventDetailResponseType>(`/club-event/${id}`, {
      headers: accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : undefined,
    }),
  joinEvent: (id: string, accessToken: string) =>
    http.post(`/club-event/join/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  getParticipants: (
    id: string,
    accessToken: string,
    page: number,
    size: number
  ) =>
    http.get<PagedParticipantResponseType>(
      `/club-event/all-participant/${id}?page=${page}&size=${size}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ),
};
export default eventClubApiRequest;
