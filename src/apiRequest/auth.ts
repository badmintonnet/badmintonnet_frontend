import http from "@/lib/http";
import {
  LoginBodyType,
  LoginResType,
  RegisterBodyType,
  RegisterResType,
  UpdatePasswordBodyType,
  VerifyBodyType,
} from "@/schemaValidations/auth.schema";
const authApiRequest = {
  login: (body: LoginBodyType) =>
    http.post<LoginResType>("/api/auth/login", body, { baseUrl: "" }),
  register: (body: RegisterBodyType) =>
    http.post<RegisterResType>("auth/register", body),
  logout: () => http.post("auth/logout", {}),
  refreshSession: () =>
    http.get<LoginResType>("/api/auth/refresh", { baseUrl: "" }),
  verify: (body: VerifyBodyType) =>
    http.post<LoginResType>("auth/verify", body),
  sendOtp: (email: string) => http.get(`auth/send-otp/${email}`),
  loginWithFirebase: (idToken: string) =>
    http.post<LoginResType>("auth/login/firebase", { idToken }),
  forgetPassword: (email: string) => http.post(`auth/forget/${email}`),
  updatePassword: (body: UpdatePasswordBodyType) =>
    http.put("auth/update-password", body),
};
export default authApiRequest;
