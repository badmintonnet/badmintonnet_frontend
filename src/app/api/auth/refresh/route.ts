import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;
    const deviceId = cookieStore.get("deviceId")?.value;

    if (!refreshToken || !deviceId) {
      return NextResponse.json(
        { message: "Missing refresh token or device id" },
        { status: 401 },
      );
    }

    // gọi backend refresh
    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/refresh`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          refreshToken,
          "X-Device-Id": deviceId,
        },
        credentials: "include",
      },
    );

    const data = await backendRes.json();

    // ⚡ luôn coi là dev
    const sameSite = "Lax";
    const secure = ""; // dev => không dùng Secure

    const response = NextResponse.json(data, { status: backendRes.status });

    // accessToken
    if (data?.data?.accessToken) {
      response.headers.append(
        "Set-Cookie",
        `accessToken=${data.data.accessToken}; Path=/; HttpOnly; Max-Age=${
          60 * 106
        }; SameSite=${sameSite}${secure ? `; ${secure}` : ""}`,
      );
    }

    // refreshToken
    if (data?.data?.refreshToken) {
      response.headers.append(
        "Set-Cookie",
        `refreshToken=${data.data.refreshToken}; Path=/; HttpOnly; Max-Age=${
          60 * 60 * 24 * 100
        }; SameSite=${sameSite}${secure ? `; ${secure}` : ""}`,
      );
    }

    // deviceId
    if (data?.data?.deviceId) {
      response.headers.append(
        "Set-Cookie",
        `deviceId=${data.data.deviceId}; Path=/; HttpOnly; Max-Age=${
          60 * 60 * 24 * 100
        }; SameSite=${sameSite}${secure ? `; ${secure}` : ""}`,
      );
    }
    console.log(response);
    return response;
  } catch (err) {
    console.error("Error in /api/auth/refresh:", err);
    return NextResponse.json({ message: "Refresh failed" }, { status: 500 });
  }
}
