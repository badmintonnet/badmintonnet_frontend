import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "./lib/utils";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;

  // Kiểm tra nếu đường dẫn bắt đầu bằng /admin
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Nếu không có token hoặc không phải là admin, chuyển hướng về trang login
    if (!accessToken || !isAdmin(accessToken)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
