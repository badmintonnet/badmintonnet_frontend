import PlayerRatingForm from "@/app/(main)/profile/_components/player-rating-form";

export default function PlayerRatingPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const mode = searchParams.mode;
  const isEdit = mode === "edit";

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center px-6 py-12">
      {/* Header */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 -left-24 w-80 h-80 bg-green-400/20 dark:bg-green-600/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 -right-24 w-96 h-96 bg-cyan-400/20 dark:bg-cyan-600/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-400/15 dark:bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        <div
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-400/40 rounded-full animate-bounce"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="absolute top-3/4 left-3/4 w-1.5 h-1.5 bg-cyan-400/40 rounded-full animate-bounce"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/6 w-1 h-1 bg-indigo-400/40 rounded-full animate-bounce"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/6 right-1/4 w-2 h-2 bg-pink-400/40 rounded-full animate-bounce"
          style={{ animationDelay: "1.5s" }}
        />
      </div>
      <div className="relative z-10 w-full max-w-5xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-6 py-2.5 mb-6 text-sm font-semibold rounded-full bg-gradient-to-r from-emerald-100 via-teal-100 to-cyan-100 text-emerald-800 dark:from-emerald-900/30 dark:via-teal-900/30 dark:to-cyan-900/30 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-700/30 shadow-lg">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            {isEdit ? "Chỉnh sửa đánh giá" : "Tự đánh giá trình độ bản thân"}
          </div>

          <h1 className="text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent mb-6 leading-tight">
            {isEdit ? "Cập Nhật Năng Lực" : "Đánh Giá Năng Lực"}
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed font-light">
            {isEdit
              ? "Điều chỉnh thông tin đánh giá để hệ thống gợi ý đối thủ, CLB và hoạt động phù hợp với bạn."
              : "Hoàn thành bảng đánh giá để hệ thống gợi ý đối thủ, CLB và hoạt động phù hợp với bạn."}
          </p>
        </div>

        {/* Form */}
        <div className="relative">
          <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/30 shadow-2xl"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/20 via-transparent to-cyan-100/20 dark:from-emerald-900/10 dark:via-transparent dark:to-cyan-900/10 rounded-3xl"></div>
          <div className="relative z-10 p-10 md:p-16">
            <PlayerRatingForm />
          </div>
        </div>
      </div>
    </main>
  );
}
