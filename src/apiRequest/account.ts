import http from "@/lib/http";

import {
  AccountResType,
  PlayerRatingCreateBodyType,
  PlayerRatingResponseType,
  UpdateProfileBodyType,
} from "@/schemaValidations/account.schema";
import {
  FileResType,
  ListStringResType,
} from "@/schemaValidations/common.schema";

const accountApiRequest = {
  uploadImageAvatar: (body: FormData) =>
    http.post<FileResType>("/account/upload", body),

  getAccount: (accessToken: string) =>
    http.get<AccountResType>("/account", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),

  updateProfile: (body: UpdateProfileBodyType) =>
    http.put<AccountResType>("/account/profile", body),
  getAllClubId: (accessToken: string) =>
    http.get<ListStringResType>("/account/get-all-club-id", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  createPlayerRating: (body: PlayerRatingCreateBodyType) =>
    http.post("/account/player-rating", body),

  getPlayerRating: (accessToken?: string) =>
    http.get<PlayerRatingResponseType>("/account/player-rating", {
      ...(accessToken
        ? {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        : {}),
    }),
};
export default accountApiRequest;
