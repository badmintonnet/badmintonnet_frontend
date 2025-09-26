import http from "@/lib/http";

import { FileResType } from "@/schemaValidations/common.schema";
import {
  CreateEventClubBodyType,
  EventDetailResponseType,
  EventParticipantStatus,
  PagedEventResponseType,
  PagedParticipantResponseType,
  ParticipantType,
  UpdateEventClubBodyType,
  UpdateEventParticipantStatus,
} from "@/schemaValidations/event.schema";
import { Update } from "next/dist/build/swc/types";

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

  updateEventClub: (body: Partial<UpdateEventClubBodyType>) =>
    http.put<EventDetailResponseType>("/club-event/update", body),

  //Lấy danh sách event clubs tất cả
  getAllPublicEventClubs: (
    page: number,
    size: number,
    accessToken?: string,
    search?: string,
    province?: string,
    ward?: string
  ) => {
    const query = new URLSearchParams({
      page: String(page),
      size: String(size),
      ...(search ? { search } : {}),
      ...(province ? { province } : {}),
      ...(ward ? { ward } : {}),
    }).toString();

    return http.get<PagedEventResponseType>(`/club-event/all/public?${query}`, {
      headers: accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : undefined,
    });
  },
  getMyClubsEventClubs: (page: number, size: number, accessToken: string) =>
    http.get<PagedEventResponseType>(
      `/club-event/all/my_clubs?page=${page}&size=${size}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ),
  getEventById: (slug: string, accessToken: string) =>
    http.get<EventDetailResponseType>(`/club-event/${slug}`, {
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
  getParticipants: (id: string, accessToken: string) =>
    http.get<PagedParticipantResponseType>(
      `/club-event/all-participant/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ),

  getMyJoinedEventClubs: (page: number, size: number, accessToken: string) =>
    http.get<PagedEventResponseType>(
      `/club-event/all/joined?page=${page}&size=${size}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ),
  approvedParticipant: (id: string, eventId: string) =>
    http.put(`/club-event/${eventId}/participant/${id}/approve`),

  rejectParticipant: (id: string, eventId: string) =>
    http.put(`/club-event/${eventId}/participant/${id}/reject`),
  updateStatusParticipant: (
    id: string,
    eventId: string,
    body: UpdateEventParticipantStatus
  ) => http.put(`/club-event/${eventId}/participant/${id}`, body),
};
export default eventClubApiRequest;
