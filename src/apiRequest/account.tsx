import http from "@/lib/http";

import {
  AccountResType,
  UpdateProfileBodyType,
} from "@/schemaValidations/account.schema";
import { FileResType } from "@/schemaValidations/common.schema";

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
};
export default accountApiRequest;
