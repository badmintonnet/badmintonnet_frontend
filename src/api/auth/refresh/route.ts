import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 👉 Lấy cookie từ request
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;
    const deviceId = cookieStore.get("deviceId")?.value;

    if (!refreshToken || !deviceId) {
      return NextResponse.json(
        { message: "Missing refresh token or device id" },
        { status: 401 }
      );
    }

    // 👉 Gọi tới backend /refresh, gửi cookie kèm theo
    const backendRes = await fetch(`${process.env.BACKEND_API}/refresh`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // forward bằng header
        refreshToken,
        "X-Device-Id": deviceId,
      },
      credentials: "include", // để backend set lại cookie mới
    });

    const data = await backendRes.json();

    // 👉 Forward lại cookie response từ backend về client
    const setCookieHeaders = backendRes.headers.getSetCookie();

    const response = NextResponse.json(data, { status: backendRes.status });
    if (setCookieHeaders) {
      setCookieHeaders.forEach((cookie: string) => {
        response.headers.append("Set-Cookie", cookie);
      });
    }

    return response;
  } catch (err) {
    console.error("Error in /api/auth/refresh:", err);
    return NextResponse.json({ message: "Refresh failed" }, { status: 500 });
  }
}
