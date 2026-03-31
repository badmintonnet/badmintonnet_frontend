import TournamentTabs from "./_components/tournament-tabs";

export const dynamic = "force-dynamic";

export default async function TournamentList() {
  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-300">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-2">
          Giải Đấu Cầu Lông
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Danh sách các giải đấu được tổ chức trong tháng
        </p>
      </div>

      {/* Tabs + Danh sách giải đấu */}
      <TournamentTabs />

      {/* Hiệu ứng nền mờ nhẹ */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-green-500/10 via-transparent to-blue-600/20 blur-3xl opacity-70 dark:from-green-900/20 dark:to-blue-900/20" />
    </div>
  );
}
