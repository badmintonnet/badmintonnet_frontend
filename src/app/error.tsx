"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Runtime Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Animated Gradient Grid Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-950 to-emerald-950">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(16, 185, 129, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      {/* Glowing Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full filter blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/30 rounded-full filter blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
        {/* Error Card */}
        <div className="max-w-2xl w-full">
          <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-2xl rounded-3xl border border-emerald-500/20 shadow-2xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-blue-500 via-emerald-500 to-blue-500"></div>

            <div className="p-10 text-center">
              <h1
                className="text-8xl md:text-9xl font-black mb-4 bg-gradient-to-r from-red-400 via-orange-400 to-red-400 bg-clip-text text-transparent animate-pulse"
                style={{ WebkitBackgroundClip: "text" }}
              >
                500
              </h1>

              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
                <span className="text-4xl">🔥</span>
                <div className="w-12 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Lỗi Hệ Thống!
              </h2>
              <p className="text-gray-400 text-lg mb-6">
                Có vẻ cú đập cầu này hơi mạnh… hệ thống của chúng ta bị “ngất”
                tạm thời rồi 🏸
              </p>

              <div className="bg-slate-950/50 rounded-2xl p-6 mb-8 border border-slate-700/50">
                <p className="text-gray-300 text-center leading-relaxed">
                  Đừng lo! Bạn có thể thử tải lại trang hoặc quay lại sân chính
                  để tiếp tục trận đấu.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => reset()}
                  className="flex-1 group relative px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 rounded-xl font-bold text-white overflow-hidden transition-all hover:scale-105 hover:shadow-xl hover:shadow-red-500/50 text-center"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m0 0A10 10 0 1012 2v2.5"
                      />
                    </svg>
                    Thử Lại
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>

                <Link
                  href="/"
                  className="flex-1 group relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-xl font-bold text-white overflow-hidden transition-all hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/50 text-center"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                    Về Trang Chủ
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-700">
                <div className="flex items-start gap-3 text-sm text-gray-400">
                  <span className="text-xl">💡</span>
                  <p className="leading-relaxed">
                    <span className="text-emerald-400 font-semibold">Mẹo:</span>{" "}
                    Nếu lỗi này tiếp diễn, có thể backend đang cần “nghỉ giữa
                    hiệp”. Hãy thử lại sau vài phút nhé!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-8 text-gray-600 text-sm">
          Error Code: SYSTEM_SHUTTLE_MISFIRE
        </p>
      </div>
    </div>
  );
}
