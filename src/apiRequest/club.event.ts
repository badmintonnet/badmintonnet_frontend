import http from "@/lib/http";

import { FileResType } from "@/schemaValidations/common.schema";
import {
  CreateEventClubBodyType,
  EventDetailResponseType,
  PagedEventResponseType,
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
  getEventById: (id: string, accessToken: string) =>
    http.get<EventDetailResponseType>(`/club-event/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
};
export default eventClubApiRequest;
