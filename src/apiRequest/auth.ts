import http from "@/lib/http";
import {
  LoginBodyType,
  LoginResType,
  RegisterBodyType,
  RegisterResType,
  SlideSessionResType,
} from "@/schemaValidations/auth.schema";
const authApiRequest = {
  login: (body: LoginBodyType) => http.post<LoginResType>("auth/login", body),
  register: (body: RegisterBodyType) =>
    http.post<RegisterResType>("auth/register", body),
  logout: () => http.post("auth/logout", {}),
};
export default authApiRequest;
