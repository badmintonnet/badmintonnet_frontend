import http from "@/lib/http";
import {
  RatingBodyType,
  RatingDetailResponseType,
  RatingPageResponseType,
  RatingResponseType,
  RatingSummaryResponseType,
  ReplyBodyType,
} from "@/schemaValidations/rating.schema";

const ratingApiRequest = {
  getRatingByClub: (id: string, token = "") =>
    http.get<RatingResponseType>(`/club-event-rating/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),
  getRatingByClubId: (id: string) =>
    http.get<RatingSummaryResponseType>(`/club-event-rating/club/${id}`),
  getOwnRating: (id: string) =>
    http.get<RatingDetailResponseType>(`/club-event-rating/own/${id}`),
  postRating: (body: RatingBodyType) =>
    http.post<RatingBodyType>(`/club-event-rating`, body),
  postReply: (body: ReplyBodyType) =>
    http.post<RatingBodyType>(`/club-event-rating/reply`, body),
  getMoreRatings: (id: string, page: number, size: number) =>
    http.get<RatingPageResponseType>(
      `/club-event-rating/club/${id}/more?page=${page}&size=${size}`
    ),
};
export default ratingApiRequest;
