import tournamentApiRequest from "@/apiRequest/tournament";
import TournamentPage from "./_components/tournament-page";
import Link from "next/link";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function TournamentList({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");

  const params = await searchParams;
  const page = parseInt(params.page || "0", 10);
  const size = 20;

  const response = await tournamentApiRequest.getAllTournaments(
    page,
    size,
    accessToken?.value || ""
  );

  const data = response.payload.data;
  const tournaments = data.content;
  const { totalPages } = data;

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900  py-8  transition-colors duration-300">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-2">
          Giải Đấu Câu Lạc Bộ
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Danh sách các giải đấu được tổ chức trong tháng
        </p>
      </div>

      {/* Danh sách giải đấu */}
      <TournamentPage tournaments={tournaments} />

      {/* PHÂN TRANG */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12 gap-3">
          {Array.from({ length: totalPages }, (_, i) => (
            <Link
              key={i}
              href={`?page=${i}`}
              className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-200 ${
                i === page
                  ? "bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg"
                  : "bg-white/10 text-gray-800 dark:text-gray-300 hover:bg-gradient-to-r hover:from-green-600 hover:to-blue-600 hover:text-white"
              }`}
            >
              {i + 1}
            </Link>
          ))}
        </div>
      )}

      {/* Hiệu ứng nền mờ nhẹ */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-green-500/10 via-transparent to-blue-600/20 blur-3xl opacity-70 dark:from-green-900/20 dark:to-blue-900/20" />
    </div>
  );
}
