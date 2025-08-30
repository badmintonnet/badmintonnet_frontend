/* eslint-disable @typescript-eslint/no-explicit-any */
import envConfig from "@/config";
import { normalizePath } from "@/lib/utils";
import { LoginResType } from "@/schemaValidations/auth.schema";
import { redirect } from "next/navigation";

type CustomOptions = Omit<RequestInit, "method"> & {
  baseUrl?: string | undefined;
};

const ENTITY_ERROR_STATUS = 422;
const AUTHENTICATION_ERROR_STATUS = 401;
const CONFLICT_ERROR_STATUS = 409;
const SERVER_ERROR_STATUS = 500;

type EntityErrorPayload = {
  message: string;
  errors: {
    field: string;
    message: string;
  }[];
};

export class HttpError extends Error {
  status: number;
  payload: {
    message: string;
    [key: string]: any;
  };
  constructor({ status, payload }: { status: number; payload: any }) {
    super("Http Error");
    this.status = status;
    this.payload = payload;
  }
}

export class EntityError extends HttpError {
  status: 422;
  payload: EntityErrorPayload;
  constructor({
    status,
    payload,
  }: {
    status: 422;
    payload: EntityErrorPayload;
  }) {
    super({ status, payload });
    this.status = status;
    this.payload = payload;
  }
}

export class ConflictError extends HttpError {
  status: 409;
  payload: EntityErrorPayload;
  constructor({
    status,
    payload,
  }: {
    status: 409;
    payload: EntityErrorPayload;
  }) {
    super({ status, payload });
    this.status = status;
    this.payload = payload;
  }
}

/**
 * Lưu accessToken, refreshToken, deviceId ở client
 */
class SessionToken {
  private accessToken = "";
  private refreshToken = "";
  private deviceId = "";

  get value() {
    return this.accessToken;
  }
  set value(accessToken: string) {
    if (typeof window === "undefined") {
      throw new Error("Cannot set token on server side");
    }
    this.accessToken = accessToken;
  }

  get refreshValue() {
    return this.refreshToken;
  }
  set refreshValue(refreshToken: string) {
    if (typeof window === "undefined") {
      throw new Error("Cannot set refresh token on server side");
    }
    this.refreshToken = refreshToken;
  }

  get deviceIdValue() {
    return this.deviceId;
  }
  set deviceIdValue(deviceId: string) {
    if (typeof window === "undefined") {
      throw new Error("Cannot set deviceId on server side");
    }
    this.deviceId = deviceId;
  }
}

export const clientSessionToken = new SessionToken();

/**
 * Hàm gọi API
 */
const request = async <Response>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options?: CustomOptions | undefined
): Promise<{ status: number; payload: Response }> => {
  const body = options?.body
    ? options.body instanceof FormData
      ? options.body
      : JSON.stringify(options.body)
    : undefined;

  const baseHeaders: Record<string, string> =
    body instanceof FormData
      ? {
          Authorization: clientSessionToken.value
            ? `Bearer ${clientSessionToken.value}`
            : "",
          "X-Device-Id": clientSessionToken.deviceIdValue || "",
          refreshToken: clientSessionToken.refreshValue || "",
        }
      : {
          "Content-Type": "application/json",
          Authorization: clientSessionToken.value
            ? `Bearer ${clientSessionToken.value}`
            : "",
          "X-Device-Id": clientSessionToken.deviceIdValue || "",
          refreshToken: clientSessionToken.refreshValue || "",
        };

  const baseUrl =
    options?.baseUrl === undefined
      ? envConfig.NEXT_PUBLIC_API_ENDPOINT
      : options.baseUrl;

  const fullUrl = url.startsWith("/")
    ? `${baseUrl}${url}`
    : `${baseUrl}/${url}`;

  let res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    },
    body,
    method,
    credentials: "include", // gửi cookie HttpOnly
  });

  // Nếu accessToken hết hạn → gọi refresh
  if (res.status === AUTHENTICATION_ERROR_STATUS) {
    if (typeof window !== "undefined") {
      // 👉 Client side: gọi API backend để refresh
      try {
        const refreshRes = await fetch(
          `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/refresh`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "X-Device-Id": clientSessionToken.deviceIdValue,
              refreshToken: clientSessionToken.refreshValue,
            },
            credentials: "include",
          }
        );

        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          const { accessToken, refreshToken, deviceId } = refreshData.data;

          clientSessionToken.value = accessToken;
          clientSessionToken.refreshValue = refreshToken;
          clientSessionToken.deviceIdValue = deviceId;

          // retry request gốc
          res = await fetch(fullUrl, {
            ...options,
            headers: {
              ...baseHeaders,
              Authorization: `Bearer ${accessToken}`,
              "X-Device-Id": deviceId,
              refreshToken,
            },
            body,
            method,
            credentials: "include",
          });
        } else {
          location.href = "/login";
        }
      } catch (err) {
        console.error("Refresh token failed:", err);
        location.href = "/login";
      }
    } else {
      // 👉 Server side
      try {
        const refreshRes = await fetch(
          `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/refresh`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            cache: "no-store",
          }
        );

        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          const { accessToken, refreshToken, deviceId } = refreshData.data;

          // retry request gốc
          res = await fetch(fullUrl, {
            ...options,
            headers: {
              ...baseHeaders,
              Authorization: `Bearer ${accessToken}`,
              "X-Device-Id": deviceId,
              refreshToken,
            },
            body,
            method,
          });
        } else {
          redirect("/login");
        }
      } catch (err) {
        console.error("Server refresh token failed:", err);
        redirect("/login");
      }
    }
  }

  let payload: Response;
  try {
    payload = await res.json();
  } catch {
    payload = {} as Response;
  }

  const data = {
    status: res.status,
    payload,
  };

  if (!res.ok) {
    if (res.status === ENTITY_ERROR_STATUS) {
      throw new EntityError(
        data as {
          status: 422;
          payload: EntityErrorPayload;
        }
      );
    }

    if (res.status === CONFLICT_ERROR_STATUS) {
      throw new ConflictError(
        data as {
          status: 409;
          payload: EntityErrorPayload;
        }
      );
    }

    if (res.status >= SERVER_ERROR_STATUS) {
      // 👉 Quăng lỗi 500 để try/catch xử lý ở ngoài
      throw new HttpError({
        status: res.status,
        payload: payload || { message: "Internal server error" },
      });
    }
  }

  // Lưu token sau khi login/register
  if (typeof window !== "undefined") {
    if (
      ["auth/login", "auth/register"].some(
        (item) => item === normalizePath(url)
      )
    ) {
      clientSessionToken.value = (payload as LoginResType).data.accessToken;
      clientSessionToken.refreshValue = (
        payload as LoginResType
      ).data.refreshToken;
      clientSessionToken.deviceIdValue = (
        payload as LoginResType
      ).data.deviceId;
    } else if ("auth/logout" === normalizePath(url)) {
      clientSessionToken.value = "";
      clientSessionToken.refreshValue = "";
      clientSessionToken.deviceIdValue = "";
    }
  }

  return data;
};

const http = {
  get<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("GET", url, options);
  },
  post<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("POST", url, { ...options, body });
  },
  put<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("PUT", url, { ...options, body });
  },
  delete<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("DELETE", url, { ...options, body });
  },
};

export default http;
