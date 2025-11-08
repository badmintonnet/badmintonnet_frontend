import http from "@/lib/http";
import {
  LoginBodyType,
  LoginResType,
  RegisterBodyType,
  RegisterResType,
  SlideSessionResType,
  VerifyBodyType,
} from "@/schemaValidations/auth.schema";
import { verify } from "crypto";
const authApiRequest = {
  login: (body: LoginBodyType) => http.post<LoginResType>("auth/login", body),
  register: (body: RegisterBodyType) =>
    http.post<RegisterResType>("auth/register", body),
  logout: () => http.post("auth/logout", {}),
  refreshSession: () => http.get<LoginResType>("auth/refresh", {}),
  verify: (body: VerifyBodyType) =>
    http.post<LoginResType>("auth/verify", body),
  sendOtp: (email: string) => http.get(`auth/send-otp/${email}`),
};
export default authApiRequest;
