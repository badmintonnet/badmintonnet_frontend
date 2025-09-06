import CreateEventClubForm from "@/app/(main)/my-clubs/_components/create-event-club-form";

interface CreateActivityPageProps {
  searchParams: Promise<{ club?: string }>;
}

export default async function CreateActivityPage({
  searchParams,
}: CreateActivityPageProps) {
  const { club } = await searchParams;

  if (!club) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Lỗi</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Không tìm thấy thông tin câu lạc bộ. Vui lòng quay lại trang trước.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center px-6 py-12">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 -left-24 w-80 h-80 bg-purple-400/20 dark:bg-purple-600/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 -right-24 w-96 h-96 bg-cyan-400/20 dark:bg-cyan-600/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-400/15 dark:bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        <div
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400/40 rounded-full animate-bounce"
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

      <div className="relative z-10 w-full max-w-6xl">
        {/* Header section with enhanced styling */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-6 py-2.5 mb-6 text-sm font-semibold rounded-full bg-gradient-to-r from-purple-100 via-indigo-100 to-cyan-100 text-purple-800 dark:from-purple-900/30 dark:via-indigo-900/30 dark:to-cyan-900/30 dark:text-purple-300 border border-purple-200/50 dark:border-purple-700/30 shadow-lg">
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
            Tạo hoạt động thể thao mới
          </div>

          <h1 className="text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 dark:from-purple-400 dark:via-indigo-400 dark:to-cyan-400 bg-clip-text text-transparent mb-6 leading-tight">
            Tạo Hoạt Động
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed font-light">
            Tổ chức các buổi tập luyện, giải đấu và sự kiện đặc biệt.
            <span className="block mt-2 text-lg text-gray-500 dark:text-gray-500">
              Kết nối thành viên qua những hoạt động thú vị và bổ ích.
            </span>
          </p>
        </div>

        {/* Enhanced form wrapper with glassmorphism effect */}
        <div className="relative">
          {/* Glass card effect */}
          <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/30 shadow-2xl"></div>

          {/* Inner glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 via-transparent to-cyan-100/20 dark:from-purple-900/10 dark:via-transparent dark:to-cyan-900/10 rounded-3xl"></div>

          {/* Form content */}
          <div className="relative z-10 p-10 md:p-16">
            {/* Icon section */}

            <CreateEventClubForm clubSlug={club} />
          </div>
        </div>

        {/* Bottom decorative text */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-500 dark:text-gray-600 font-medium">
            🏃‍♂️ Bắt đầu hành trình thể thao cùng cộng đồng của bạn
          </p>
        </div>
      </div>
    </main>
  );
}
