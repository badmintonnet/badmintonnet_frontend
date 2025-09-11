import http from "@/lib/http";
import {
  RatingBodyType,
  RatingDetailResponseType,
  RatingResponseType,
  ReplyBodyType,
} from "@/schemaValidations/rating.schema";

const ratingApiRequest = {
  getRatingByClub: (id: string, token = "") =>
    http.get<RatingResponseType>(`/club-event-rating/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),
  getOwnRating: (id: string) =>
    http.get<RatingDetailResponseType>(`/club-event-rating/own/${id}`),
  postRating: (body: RatingBodyType) =>
    http.post<RatingBodyType>(`/club-event-rating`, body),
  postReply: (body: ReplyBodyType) =>
    http.post<RatingBodyType>(`/club-event-rating/reply`, body),
};
export default ratingApiRequest;
