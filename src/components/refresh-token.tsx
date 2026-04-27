/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import authApiRequest from "@/apiRequest/auth";
import { clientSessionToken } from "@/lib/http";

// Kiểu payload JWT
interface JwtPayload {
  exp: number;
  iat: number;
  sub: string;
  [key: string]: any;
}

export default function R() {
  useEffect(() => {
    const interval = setInterval(
      async () => {
        try {
          const accessToken = clientSessionToken.value;
          const deviceId = clientSessionToken.deviceIdValue;
          if (!accessToken || !deviceId) return;

          // Decode JWT để lấy exp
          const decoded: JwtPayload = jwtDecode(accessToken);
          const now = Date.now();
          const expiresAt = decoded.exp * 1000; // chuyển sang ms

          // Nếu còn dưới 2 phút → refresh token
          if (expiresAt - now < 2 * 60 * 1000) {
            const res = await authApiRequest.refreshSession();

            // Lưu accessToken mới
            if (res.payload.data.accessToken) {
              clientSessionToken.value = res.payload.data.accessToken;
              clientSessionToken.refreshValue = res.payload.data.refreshToken;
              clientSessionToken.deviceIdValue = res.payload.data.deviceId;
            }

            console.log(
              "Access token refreshed at",
              new Date().toLocaleTimeString(),
            );
          }
        } catch (err) {
          console.error("Failed to refresh session:", err);
          // Nếu refresh token hết hạn → redirect về login
          window.location.href = "/login";
        }
      },
      1000 * 60 * 5,
    );

    return () => clearInterval(interval);
  }, []);

  return null;
}
