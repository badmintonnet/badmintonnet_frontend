import { NextResponse } from "next/server";

const ACCESS_TOKEN_MAX_AGE = 60 * 106;
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 100;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await backendRes.json();
    const response = NextResponse.json(data, { status: backendRes.status });

    if (backendRes.ok && data?.data) {
      const secure = process.env.NEXT_PUBLIC_SITE_URL?.startsWith("https://");
      const cookieOptions = {
        httpOnly: true,
        sameSite: "lax" as const,
        secure,
        path: "/",
      };

      if (data.data.accessToken) {
        response.cookies.set("accessToken", data.data.accessToken, {
          ...cookieOptions,
          maxAge: ACCESS_TOKEN_MAX_AGE,
        });
      }

      if (data.data.refreshToken) {
        response.cookies.set("refreshToken", data.data.refreshToken, {
          ...cookieOptions,
          maxAge: REFRESH_TOKEN_MAX_AGE,
        });
      }

      if (data.data.deviceId) {
        response.cookies.set("deviceId", data.data.deviceId, {
          ...cookieOptions,
          maxAge: REFRESH_TOKEN_MAX_AGE,
        });
      }
    }

    return response;
  } catch (error) {
    console.error("Error in /api/auth/login:", error);
    return NextResponse.json({ message: "Login failed" }, { status: 500 });
  }
}
