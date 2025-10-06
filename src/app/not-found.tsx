"use client"; // 👈 thêm dòng này

import Link from "next/link";

export default function Badminton404() {
  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Animated Grid Background */}
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
        {/* 404 Content Card */}
        <div className="max-w-2xl w-full">
          <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-2xl rounded-3xl border border-emerald-500/20 shadow-2xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-blue-500 via-emerald-500 to-blue-500"></div>

            <div className="p-10">
              <div className="text-center mb-8">
                <h1
                  className="text-8xl md:text-9xl font-black mb-4 bg-gradient-to-r from-blue-400 via-emerald-400 to-blue-400 bg-clip-text text-transparent animate-pulse"
                  style={{ WebkitBackgroundClip: "text" }}
                >
                  404
                </h1>
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-12 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
                  <span className="text-4xl">🏸</span>
                  <div className="w-12 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  Out of Bounds!
                </h2>
                <p className="text-gray-400 text-lg">
                  Trang bạn tìm kiếm đã bay ra ngoài sân
                </p>
              </div>

              <div className="bg-slate-950/50 rounded-2xl p-6 mb-8 border border-slate-700/50">
                <p className="text-gray-300 text-center leading-relaxed">
                  Giống như một cú đánh cầu mạnh mẽ, trang này đã bay đi đâu mất
                  rồi. Đừng lo lắng, hãy quay lại sân và tiếp tục trận đấu!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {/* Nút về trang chủ */}
                <Link
                  href="/"
                  className="flex-1 group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl font-bold text-white overflow-hidden transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-500/50 text-center"
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
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    Về Trang Chủ
                  </span>
                </Link>

                {/* Nút quay lại */}
                <button
                  type="button" // Thêm dòng này!
                  onClick={() => window.history.back()}
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
                    Quay Lại
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-700">
                <div className="flex items-start gap-3 text-sm text-gray-400">
                  <span className="text-xl">💡</span>
                  <p className="leading-relaxed">
                    <span className="text-emerald-400 font-semibold">
                      Fun fact:
                    </span>{" "}
                    Kỷ lục tốc độ quả cầu lông nhanh nhất là 565 km/h, nhanh hơn
                    cả tàu cao tốc!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-8 text-gray-600 text-sm">
          Error Code: SHUTTLECOCK_NOT_FOUND
        </p>
      </div>
    </div>
  );
}
