import Image from "next/image";
import Link from "next/link";
import { MapPin, Users, User, Calendar, ArrowRight } from "lucide-react";
import clubServiceApi from "@/apiRequest/club";
import { cookies } from "next/headers";

export default async function MyClubs({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");

  // Lấy params từ URL
  const params = (await searchParams) || {};
  const page = parseInt(params.page || "0", 10);
  const size = 10;

  let clubsResponse;
  let clubs;
  let totalPages = 0;
  let currentPage = 0;

  try {
    // Lấy danh sách clubs
    clubsResponse = await clubServiceApi.getMyClubs(
      page,
      size,
      accessToken?.value || ""
    );
    clubs = clubsResponse.payload.data.content;

    totalPages = clubsResponse.payload.data.totalPages;
    currentPage = clubsResponse.payload.data.page;
  } catch (error) {
    console.log("Error fetching clubs:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-red-500">
          Đã có lỗi xảy ra khi tải câu lạc bộ của bạn.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            CLB của tôi
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Bạn đã tham gia {clubs.length} câu lạc bộ
          </p>
        </div>

        {/* Danh sách CLB */}
        <div className="space-y-4">
          {clubs.map((club) => (
            <div
              key={club.id}
              className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-300"
            >
              <div className="flex items-center gap-6">
                {/* Logo */}
                <Image
                  src={club.logoUrl || ""}
                  alt={`${club.name} logo`}
                  priority
                  width={80}
                  height={80}
                  className="rounded-xl border-2 border-gray-100 dark:border-gray-700 group-hover:border-emerald-200 dark:group-hover:border-emerald-700 transition-colors"
                />

                {/* Nội dung */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {club.name}
                    </h3>
                    {club.owner && (
                      <span
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold 
               bg-green-100 text-green-700 
               dark:bg-green-800/40 dark:text-green-300 
               border border-green-300 dark:border-green-700 shadow-sm"
                      >
                        🌟 Bạn là chủ CLB
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {club.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-500" />
                      {club.location}
                    </span>
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-500" />
                      {club.ownerName}
                    </span>
                    <span className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-500" />
                      {club.memberCount}/{club.maxMembers} thành viên
                    </span>
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-orange-500" />
                      Tham gia:{" "}
                      {new Date(club.dateJoined).toLocaleDateString("vi-VN")}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {club.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-lg border border-blue-200 dark:border-blue-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Nút Chi tiết */}
                <div className="flex-shrink-0">
                  {club.memberStatus === "PENDING" && (
                    <span className="px-4 py-2 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-lg border border-yellow-300">
                      Chờ phê duyệt của chủ CLB
                    </span>
                  )}
                  {club.memberStatus === "APPROVED" && (
                    <Link
                      href={`/my-clubs/${club.slug}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-lg group/btn"
                    >
                      Chi tiết
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state for clubs */}
        {clubs.length === 0 && (
          <div className="text-center py-16">
            <Users className="w-12 h-12 mx-auto text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-4 mb-2">
              Chưa tham gia CLB nào
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Hãy tham gia các câu lạc bộ thú vị để kết nối cộng đồng
            </p>
          </div>
        )}

        {/* Pagination for clubs */}
        {clubs.length > 0 && totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 space-x-4">
            <Link
              href={`?page=${currentPage - 1}`}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                currentPage === 0
                  ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed pointer-events-none"
                  : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              }`}
            >
              Trang trước
            </Link>

            <span className="text-gray-600 dark:text-gray-300">
              Trang {currentPage + 1} / {totalPages}
            </span>

            <Link
              href={`?page=${currentPage + 1}`}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                currentPage >= totalPages - 1
                  ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed pointer-events-none"
                  : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              }`}
            >
              Trang sau
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
